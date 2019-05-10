import { createStore } from 'react-state-manage';
import {
  GetSales,
  Sale,
  DeleteSale,
  CreateSaleParamsData,
  CreateSale,
  UpdateSale,
  saleStatus
} from '@services/gql/sale';
import { handleGraphQLError } from '@utils/index';
import dayjs from 'dayjs';
import { saleitemStatus, CreateSaleitem } from '@services/gql/saleitem';

interface IState {
  list: Sale[];
}

const initState: IState = {
  list: []
};

const LIST = new GetSales();
const DELETE = new DeleteSale();
const CREATE = new CreateSale();
const UPDATE = new UpdateSale();
const CREATEITEM = new CreateSaleitem();

const searchItem = <T extends any[]>(id: string, source: T) => {
  const index = source.findIndex(item => item.id === id);
  const data = source[index];
  return { index, data };
};

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    updateList(state, payload: Sale[]) {
      state.list = state.list = payload || [];
    },
    delete(state, payload: string) {
      const index = searchItem(payload, state.list).index;
      if (index > -1) {
        state.list.splice(index, 1);
      }
    },
    updateOne(state, payload: Sale) {
      const index = searchItem(payload.id, state.list).index;
      if (index > -1) {
        state.list[index] = payload;
      }
    },
    createOne(state, payload: Sale) {
      state.list.push(payload);
    }
  },
  effects: {
    async getList(limit: number) {
      const data = handleGraphQLError(await LIST.send({ limit: limit || 5 }));
      dispatch('updateList', data.data.sales);
    },
    async deleteSingle(id: string) {
      handleGraphQLError(await DELETE.send({ id }));
      dispatch('delete', id);
    },
    async create(data: CreateSaleParamsData) {
      const sale = {
        batch: `XS${dayjs().format('YYMMDDHHmmss')}`,
        status: saleStatus.CONFIRM,
        money: data.saleitems.reduce((total, item) => (total += item.amount * item.price), 0),
        customer: data.customer.id,
        remark: data.remark,
        saleitems: []
      };
      const res = handleGraphQLError(await CREATE.send({ data: sale }));
      const saleItems = data.saleitems.map(item => {
        return {
          price: item.price,
          amount: item.amount,
          status: saleitemStatus.ACTIVE,
          good: item.good.id,
          sale: res.data.createSale.sale.id
        };
      });
      const items = await Promise.all(
        saleItems.map(async item => {
          return handleGraphQLError(await CREATEITEM.send({ data: item })).data.createSaleitem.saleitem;
        })
      );
      const payload = res.data.createSale.sale;
      payload.saleitems = items;
      dispatch('createOne', payload);
    },
    async update(item: Sale) {
      const { id, created_at, updated_at, ...data } = item;
      const res = handleGraphQLError(await UPDATE.send({ data, id }));
      dispatch('updateOne', res.data.updateSale.sale);
    }
  }
});

export const SaleStore = { useStore, dispatch };
