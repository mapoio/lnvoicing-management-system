import { createStore } from 'react-state-manage';
import { GetModels, Model, DeleteModel, CreateModelParamsData, CreateModel, UpdateModel } from '@services/gql/model';
import { handleGraphQLError } from '@utils/index';

interface IState {
  list: Model[];
}

const initState: IState = {
  list: []
};

const LIST = new GetModels();
const DELETE = new DeleteModel();
const CREATE = new CreateModel();
const UPDATE = new UpdateModel();

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    updateList(state, payload: Model[]) {
      state.list = state.list = payload || [];
    },
    delete(state, payload: string) {
      const index = state.list.findIndex(item => item.id === payload);
      if (index > -1) {
        state.list.splice(index, 1);
      }
    },
    updateOne(state, payload: Model) {
      const index = state.list.findIndex(item => item.id === payload.id);
      if (index > -1) {
        state.list[index] = payload;
      }
    },
    createOne(state, payload: Model) {
      state.list.push(payload);
    }
  },
  effects: {
    async getList(limit: number) {
      const data = handleGraphQLError(await LIST.send({ limit: limit || 5 }));
      dispatch('updateList', data.data.models);
    },
    async deleteSingle(id: string) {
      handleGraphQLError(await DELETE.send({ id }));
      dispatch('delete', id);
    },
    async create(data: CreateModelParamsData) {
      const res = handleGraphQLError(await CREATE.send({ data }));
      dispatch('createOne', res.data.createModel.model);
    },
    async update(item: Model) {
      const { id, created_at, updated_at, ...data } = item;
      const res = handleGraphQLError(await UPDATE.send({ data, id }));
      dispatch('updateOne', res.data.updateModel.model);
    }
  }
});

export const ModelStore = { useStore, dispatch };
