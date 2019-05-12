import { createStore } from 'react-state-manage';
import {
  GetStockouts,
  Stockout,
  DeleteStockout,
  CreateStockoutParamsData,
  CreateStockout,
  UpdateStockout,
  stockoutStatus
} from '@services/gql/stockout';
import { handleGraphQLError } from '@utils/index';
import dayjs from 'dayjs';
import { CreateStock, ICreateStock, stockStatus, UpdateStock } from '@services/gql/stock';
import { SaleStore } from './sale';
import { saleStatus } from '@services/gql/sale';

interface IState {
  list: Stockout[];
}

const initState: IState = {
  list: []
};

const LIST = new GetStockouts();
const DELETE = new DeleteStockout();
const CREATE = new CreateStockout();
const UPDATE = new UpdateStockout();
const UPDATE_STOCK = new UpdateStock();

const searchItem = <T extends any[]>(id: string, source: T) => {
  const index = source.findIndex(item => item.id === id);
  const data = source[index];
  return { index, data };
};

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    updateList(state, payload: Stockout[]) {
      state.list = state.list = payload || [];
    },
    delete(state, payload: string) {
      const index = searchItem(payload, state.list).index;
      if (index > -1) {
        state.list.splice(index, 1);
      }
    },
    updateOne(state, payload: Stockout) {
      const index = searchItem(payload.id, state.list).index;
      if (index > -1) {
        state.list[index] = payload;
      }
    },
    createOne(state, payload: Stockout) {
      state.list = state.list.concat([payload]);
    }
  },
  effects: {
    async getList(limit: number) {
      const data = handleGraphQLError(await LIST.send({ limit: limit || 5 }));
      dispatch('updateList', data.data.stockouts);
    },
    async deleteSingle(id: string) {
      handleGraphQLError(await DELETE.send({ id }));
      dispatch('delete', id);
    },
    async create(data: CreateStockoutParamsData) {
      const stocks = data.sales
        .map(item =>
          item.saleitems.map(s => {
            const stockList = s.stocks;
            return stockList.map(k => ({
              id: k.id,
              saleitem: s.id
            }));
          })
        )
        .reduce((m, item) => m.concat(item), [])
        .reduce((m, item) => m.concat(item), []);
      await Promise.all(
        stocks.map(async item => {
          return handleGraphQLError(
            await UPDATE_STOCK.send({
              id: item.id,
              data: { saleitem: item.saleitem, status: stockStatus.STOCKOUT } as ICreateStock
            })
          ).data.updateStock.stock;
        })
      );
      await Promise.all(
        data.sales.map(async item => {
          return await SaleStore.dispatch('update', {
            ...item,
            status: saleStatus.STOCKOUT,
            customer: item.customer.id,
            saleitems: item.saleitems.map(i => i.id)
          });
        })
      );
      const stockout = {
        batch: `CK${dayjs().format('YYMMDDHHmmss')}`,
        status: stockoutStatus.ACTIVE,
        remark: data.remark,
        repertory: data.repertory.id,
        sales: data.sales.map(item => item.id)
      };
      const res = handleGraphQLError(await CREATE.send({ data: stockout }));
      const payload = res.data.createStockout.stockout;
      dispatch('createOne', payload);
    },
    async update(item: Stockout) {
      const { id, created_at, updated_at, ...data } = item;
      const res = handleGraphQLError(await UPDATE.send({ data, id }));
      dispatch('updateOne', res.data.updateStockout.stockout);
    }
  }
});

export const StockoutStore = { useStore, dispatch };
