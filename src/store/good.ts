import { createStore } from 'react-state-manage';
import { GetGoods, Good, DeleteGood, CreateGoodParamsData, CreateGood, UpdateGood } from '@services/gql/good';
import { handleGraphQLError } from '@utils/index';

interface IState {
  list: Good[];
}

const initState: IState = {
  list: []
};

const LIST = new GetGoods();
const DELETE = new DeleteGood();
const CREATE = new CreateGood();
const UPDATE = new UpdateGood();

const searchItem = <T extends any[]>(id: string, source: T) => {
  const index = source.findIndex(item => item.id === id);
  const data = source[index];
  return { index, data };
};

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    updateList(state, payload: Good[]) {
      state.list = state.list = payload || [];
    },
    delete(state, payload: string) {
      const index = searchItem(payload, state.list).index;
      if (index > -1) {
        state.list.splice(index, 1);
      }
    },
    updateOne(state, payload: Good) {
      const index = searchItem(payload.id, state.list).index;
      if (index > -1) {
        state.list[index] = payload;
      }
    },
    createOne(state, payload: Good) {
      state.list = state.list.concat([payload]);
    }
  },
  effects: {
    async getList(limit: number) {
      const data = handleGraphQLError(await LIST.send({ limit: limit || 5 }));
      dispatch('updateList', data.data.goods);
    },
    async deleteSingle(id: string) {
      handleGraphQLError(await DELETE.send({ id }));
      dispatch('delete', id);
    },
    async create(data: CreateGoodParamsData) {
      const res = handleGraphQLError(await CREATE.send({ data }));
      dispatch('createOne', res.data.createGoods.good);
    },
    async update(item: Good) {
      const { id, created_at, updated_at, stocks, ...data } = item;
      const res = handleGraphQLError(await UPDATE.send({ data, id }));
      dispatch('updateOne', res.data.updateGoods.good);
    }
  }
});

export const GoodStore = { useStore, dispatch };
