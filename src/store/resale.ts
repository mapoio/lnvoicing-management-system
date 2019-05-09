import { createStore } from 'react-state-manage';
import {
  GetResales,
  Resale,
  DeleteResale,
  CreateResaleParamsData,
  CreateResale,
  UpdateResale,
  resaleStatus
} from '@services/gql/resale';
import { handleGraphQLError } from '@utils/index';
import dayjs from 'dayjs';
import { resaleitemStatus, CreateResaleitem } from '@services/gql/resaleitem';

interface IState {
  list: Resale[];
}

const initState: IState = {
  list: []
};

const LIST = new GetResales();
const DELETE = new DeleteResale();
const CREATE = new CreateResale();
const UPDATE = new UpdateResale();
const CREATEITEM = new CreateResaleitem();

const searchItem = <T extends any[]>(id: string, source: T) => {
  const index = source.findIndex(item => item.id === id);
  const data = source[index];
  return { index, data };
};

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    updateList(state, payload: Resale[]) {
      state.list = state.list = payload || [];
    },
    delete(state, payload: string) {
      const index = searchItem(payload, state.list).index;
      if (index > -1) {
        state.list.splice(index, 1);
      }
    },
    updateOne(state, payload: Resale) {
      const index = searchItem(payload.id, state.list).index;
      if (index > -1) {
        state.list[index] = payload;
      }
    },
    createOne(state, payload: Resale) {
      state.list.push(payload);
    }
  },
  effects: {
    async getList(limit: number) {
      const data = handleGraphQLError(await LIST.send({ limit: limit || 5 }));
      dispatch('updateList', data.data.resales);
    },
    async deleteSingle(id: string) {
      handleGraphQLError(await DELETE.send({ id }));
      dispatch('delete', id);
    },
    async create(data: CreateResaleParamsData) {
      const resale = {
        batch: `TH${dayjs().format('YYMMDDHHmmss')}`,
        status: resaleStatus.CONFIRM,
        money: data.resaleitems.reduce((total, item) => (total += item.amount * item.price), 0),
        customer: data.customer.id,
        remark: data.remark,
        resaleitems: []
      };
      const res = handleGraphQLError(await CREATE.send({ data: resale }));
      const resaleItems = data.resaleitems.map(item => {
        return {
          price: item.price,
          amount: item.amount,
          status: resaleitemStatus.ACTIVE,
          good: item.good.id,
          resale: res.data.createResale.resale.id
        };
      });
      const items = await Promise.all(
        resaleItems.map(async item => {
          return handleGraphQLError(await CREATEITEM.send({ data: item })).data.createResaleitem.resaleitem;
        })
      );
      const payload = res.data.createResale.resale;
      payload.resaleitems = items;
      dispatch('createOne', payload);
    },
    async update(item: Resale) {
      const { id, created_at, updated_at, ...data } = item;
      const res = handleGraphQLError(await UPDATE.send({ data, id }));
      dispatch('updateOne', res.data.updateResale.resale);
    }
  }
});

export const ResaleStore = { useStore, dispatch };
