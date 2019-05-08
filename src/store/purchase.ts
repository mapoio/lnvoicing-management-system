import { createStore } from 'react-state-manage';
import {
  GetPurchases,
  Purchase,
  DeletePurchase,
  CreatePurchaseParamsData,
  CreatePurchase,
  UpdatePurchase
} from '@services/gql/purchase';
import { handleGraphQLError } from '@utils/index';

interface IState {
  list: Purchase[];
}

const initState: IState = {
  list: []
};

const LIST = new GetPurchases();
const DELETE = new DeletePurchase();
const CREATE = new CreatePurchase();
const UPDATE = new UpdatePurchase();

const searchItem = <T extends any[]>(id: string, source: T) => {
  const index = source.findIndex(item => item.id === id);
  const data = source[index];
  return { index, data };
};

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    updateList(state, payload: Purchase[]) {
      state.list = state.list = payload || [];
    },
    delete(state, payload: string) {
      const index = searchItem(payload, state.list).index;
      if (index > -1) {
        state.list.splice(index, 1);
      }
    },
    updateOne(state, payload: Purchase) {
      const index = searchItem(payload.id, state.list).index;
      if (index > -1) {
        state.list[index] = payload;
      }
    },
    createOne(state, payload: Purchase) {
      state.list.push(payload);
    }
  },
  effects: {
    async getList(limit: number) {
      const data = handleGraphQLError(await LIST.send({ limit: limit || 5 }));
      dispatch('updateList', data.data.purchases);
    },
    async deleteSingle(id: string) {
      handleGraphQLError(await DELETE.send({ id }));
      dispatch('delete', id);
    },
    async create(data: CreatePurchaseParamsData) {
      const res = handleGraphQLError(await CREATE.send({ data }));
      dispatch('createOne', res.data.createPurchase.purchase);
    },
    async update(item: Purchase) {
      const { id, created_at, updated_at, ...data } = item;
      const res = handleGraphQLError(await UPDATE.send({ data, id }));
      dispatch('updateOne', res.data.updatePurchase.purchase);
    }
  }
});

export const PurchaseStore = { useStore, dispatch };
