import { createStore } from 'react-state-manage';
import { GetBrand, Brand } from '@services/gql/goods';
import { ship } from '@utils/await';
import uuid from 'uuid/v4';

interface IState {
  list: Brand[];
}

const initState: IState = {
  list: []
};

const api = new GetBrand();

const { useStore, dispatch, getState } = createStore({
  state: initState,
  reducers: {
    updateList(state, payload: Brand[]) {
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
      dispatch('updateList', data.data.brands);
    },
    async deleteSingle(id: string) {
      await ship();
      dispatch('delete', id);
    },
    async create(item: Pick<Brand, 'name' | 'remark' | 'manufacturer'>) {
      const data: Partial<Brand> = Object.assign(
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

export const BrandStore = { useStore, dispatch };
