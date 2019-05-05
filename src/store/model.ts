import { createStore } from 'react-state-manage';
import { GetModels, Model } from '@services/gql/goods';
import { ship } from '@utils/await';
import uuid from 'uuid/v4';

interface IState {
  list: Model[];
}

const initState: IState = {
  list: []
};

const api = new GetModels();

const { useStore, dispatch, getState } = createStore({
  state: initState,
  reducers: {
    updateList(state, payload: Model[]) {
      const list = payload || [];
      state.list = list.concat(state.list);
    },
    delete(state, payload: string) {
      const index = state.list.findIndex(item => item.id === payload);
      if (index > -1) {
        state.list.splice(index, 1);
      }
    }
  },
  effects: {
    async getList(limit: number) {
      await ship();
      if (getState().list.length > 0) {
        return;
      }
      const data = await api.send({ limit: limit || 5 });
      dispatch('updateList', data.data.models);
    },
    async deleteSingle(id: string) {
      await ship();
      dispatch('delete', id);
    },
    async create(item: Pick<Model, 'name' | 'remark'>) {
      const data: Partial<Model> = Object.assign(
        {
          id: uuid()
        },
        item
      );
      await ship();
      dispatch('updateList', [data]);
    }
  }
});

export const ModelStore = { useStore, dispatch };
