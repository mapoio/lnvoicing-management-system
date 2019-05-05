import { createStore } from 'react-state-manage';
import { GetUser, IUser } from '@services/gql/user';

interface IState {
  loadding: boolean;
  list: IUser[];
}

const initState: IState = {
  loadding: false,
  list: []
};

const api = new GetUser();

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    setLoadding(state, payload: boolean) {
      state.loadding = payload;
    },
    updateList(state, payload: IUser[]) {
      state.list = [].concat(state.list, payload || []);
    }
  },
  effects: {
    async getUserData(limit: number) {
      dispatch('setLoadding', true);
      const data = await api.send({ limit: limit || 5 });
      dispatch('updateList', data.data.users);
      dispatch('setLoadding', false);
    }
  }
});

export const UserStore = { useStore, dispatch };
