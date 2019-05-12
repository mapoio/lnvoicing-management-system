import { createStore } from 'react-state-manage';
import {
  GetRepertorys,
  Repertory,
  DeleteRepertory,
  CreateRepertoryParamsData,
  CreateRepertory,
  UpdateRepertory
} from '@services/gql/repertory';
import { handleGraphQLError } from '@utils/index';

interface IState {
  list: Repertory[];
}

const initState: IState = {
  list: []
};

const LIST = new GetRepertorys();
const DELETE = new DeleteRepertory();
const CREATE = new CreateRepertory();
const UPDATE = new UpdateRepertory();

const searchItem = <T extends any[]>(id: string, source: T) => {
  const index = source.findIndex(item => item.id === id);
  const data = source[index];
  return { index, data };
};

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    updateList(state, payload: Repertory[]) {
      state.list = state.list = payload || [];
    },
    delete(state, payload: string) {
      const index = searchItem(payload, state.list).index;
      if (index > -1) {
        state.list.splice(index, 1);
      }
    },
    updateOne(state, payload: Repertory) {
      const index = searchItem(payload.id, state.list).index;
      if (index > -1) {
        state.list[index] = payload;
      }
    },
    createOne(state, payload: Repertory) {
      state.list = state.list.concat([payload]);
    }
  },
  effects: {
    async getList(limit: number) {
      const data = handleGraphQLError(await LIST.send({ limit: limit || 5 }));
      dispatch('updateList', data.data.repertorys);
    },
    async deleteSingle(id: string) {
      handleGraphQLError(await DELETE.send({ id }));
      dispatch('delete', id);
    },
    async create(data: CreateRepertoryParamsData) {
      const res = handleGraphQLError(await CREATE.send({ data }));
      dispatch('createOne', res.data.createRepertory.repertory);
    },
    async update(item: Repertory) {
      const { id, created_at, updated_at, ...data } = item;
      const res = handleGraphQLError(await UPDATE.send({ data, id }));
      dispatch('updateOne', res.data.updateRepertory.repertory);
    }
  }
});

export const RepertoryStore = { useStore, dispatch };
