import { createStore } from 'react-state-manage';
import {
  GetStockins,
  Stockin,
  DeleteStockin,
  CreateStockinParamsData,
  CreateStockin,
  UpdateStockin,
  stockinStatus
} from '@services/gql/stockin';
import { handleGraphQLError } from '@utils/index';
import dayjs from 'dayjs';
import { CreateStock, ICreateStock, stockStatus } from '@services/gql/stock';
import { purchaseStatus } from '@services/gql/purchase';
import { PurchaseStore } from './purchase';
import { ResaleStore } from './resale';
import { resaleStatus } from '@services/gql/resale';

interface IState {
  list: Stockin[];
}

const initState: IState = {
  list: []
};

interface ICreateStockList {
  goodsCode: string;
  repertory: string;
  goods: string;
  purchaseitem?: string;
  resaleitem?: string;
}

const LIST = new GetStockins();
const DELETE = new DeleteStockin();
const CREATE = new CreateStockin();
const UPDATE = new UpdateStockin();
const CREATE_STOCK = new CreateStock();

const searchItem = <T extends any[]>(id: string, source: T) => {
  const index = source.findIndex(item => item.id === id);
  const data = source[index];
  return { index, data };
};

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    updateList(state, payload: Stockin[]) {
      state.list = state.list = payload || [];
    },
    delete(state, payload: string) {
      const index = searchItem(payload, state.list).index;
      if (index > -1) {
        state.list.splice(index, 1);
      }
    },
    updateOne(state, payload: Stockin) {
      const index = searchItem(payload.id, state.list).index;
      if (index > -1) {
        state.list[index] = payload;
      }
    },
    createOne(state, payload: Stockin) {
      state.list = state.list.concat([payload]);
    }
  },
  effects: {
    async getList(limit: number) {
      const data = handleGraphQLError(await LIST.send({ limit: limit || 5 }));
      dispatch('updateList', data.data.stockins);
    },
    async deleteSingle(id: string) {
      handleGraphQLError(await DELETE.send({ id }));
      dispatch('delete', id);
    },
    async create(data: CreateStockinParamsData) {
      const purchasesStocks: ICreateStockList[] = data.purchases
        .map(item =>
          item.purchaseitems.map(s => {
            const stockList = s.stocks as string[];
            return stockList.map(k => ({
              goodsCode: k,
              repertory: data.repertory.id,
              goods: s.good.id,
              purchaseitem: s.id
            }));
          })
        )
        .reduce((m, item) => m.concat(item), [])
        .reduce((m, item) => m.concat(item), []);

      const resalesStocks: ICreateStockList[] = data.resales
        .map(item =>
          item.resaleitems.map(s => {
            const stockList = s.stocks as string[];
            return stockList.map(k => ({
              goodsCode: k,
              repertory: data.repertory.id,
              goods: s.good.id,
              resaleitem: s.id
            }));
          })
        )
        .reduce((m, item) => m.concat(item), [])
        .reduce((m, item) => m.concat(item), []);
      const stocks = purchasesStocks.concat(resalesStocks);
      await Promise.all(
        stocks.map(async item => {
          return handleGraphQLError(
            await CREATE_STOCK.send({ data: { ...item, status: stockStatus.STOCKIN } as ICreateStock })
          ).data.createStock.stock;
        })
      );
      await Promise.all(
        data.purchases.map(async item => {
          return await PurchaseStore.dispatch('update', {
            ...item,
            status: purchaseStatus.STOCKIN,
            purchaseitems: item.purchaseitems.map(i => i.id),
            supplier: item.supplier.id
          });
        })
      );
      await Promise.all(
        data.resales.map(async item => {
          return await ResaleStore.dispatch('update', {
            ...item,
            status: resaleStatus.STOCKIN,
            customer: item.customer.id,
            resaleitems: item.resaleitems.map(i => i.id)
          });
        })
      );
      const stockin = {
        batch: `RK${dayjs().format('YYMMDDHHmmss')}`,
        status: stockinStatus.ACTIVE,
        remark: data.remark,
        repertory: data.repertory.id,
        purchases: data.purchases.map(item => item.id),
        resales: data.resales.map(item => item.id)
      };
      const res = handleGraphQLError(await CREATE.send({ data: stockin }));
      const payload = res.data.createStockin.stockin;
      dispatch('createOne', payload);
    },
    async update(item: Stockin) {
      const { id, created_at, updated_at, ...data } = item;
      const res = handleGraphQLError(await UPDATE.send({ data, id }));
      dispatch('updateOne', res.data.updateStockin.stockin);
    }
  }
});

export const StockinStore = { useStore, dispatch };
