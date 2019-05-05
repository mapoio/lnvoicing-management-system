import { createStore } from 'react-state-manage';
import { GetGoodses, IGoodsWithInfo } from '@services/gql/goods';
import { ship } from '@utils/await';

interface IState {
  list: IGoodsWithInfo[];
}

const initState: IState = {
  list: []
};

const api = new GetGoodses();

const { useStore, dispatch, getState } = createStore({
  state: initState,
  reducers: {
    updateGoodsList(state, payload: IGoodsWithInfo[]) {
      const list = payload || [];
      state.list = list.concat(state.list);
    },
    updateGoodsStatus(state, payload: IGoodsWithInfo) {
      const index = state.list.findIndex(item => item.id === payload.id);
      if (index > -1) {
        state.list[index] = payload;
      }
    },
    deleteGoods(state, payload: string) {
      const index = state.list.findIndex(item => item.id === payload);
      if (index > -1) {
        state.list.splice(index, 1);
      }
    }
  },
  effects: {
    async getGoodsData(limit: number) {
      await ship();
      if (getState().list.length > 0) {
        return;
      }
      const data = await api.send({ limit: limit || 5 });
      dispatch('updateGoodsList', data.data.goods);
    },
    async setActiveStatus(goods: IGoodsWithInfo) {
      await ship();
      dispatch('updateGoodsStatus', goods);
    },
    async deleteSingleGoods(id: string) {
      await ship();
      dispatch('deleteGoods', id);
    }
  }
});

export const GoodsStore = { useStore, dispatch };
