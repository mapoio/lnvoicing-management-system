import { createStore } from 'react-state-manage';
import { setCookie, clearCookie } from '@utils/index';
import { COOKIE_KEYS, LOCALSTORAGE_KEYS } from '@constants/index';
import { hashHistory } from './router';
import * as api from '@services/api';

interface LoginParams {
  account: string;
  passsword: string;
}

export interface UserInfo {
  msg: string;
  token: string;
  category: string;
}

interface IState {
  userInfo: UserInfo;
  loadding: boolean;
}

const initState: IState = {
  userInfo: null,
  loadding: false
};

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    initUserInfo(state) {
      const lcoalUserInfo = localStorage.getItem(LOCALSTORAGE_KEYS.USERINFO);
      if (!lcoalUserInfo) {
        throw new Error('no local userinfo!!');
      }
      const userInfo: UserInfo = JSON.parse(lcoalUserInfo);
      state.userInfo = userInfo;
    },
    setUserInfo(state, userInfo: UserInfo) {
      state.userInfo = userInfo;
    },
    logout() {
      clearCookie(COOKIE_KEYS.TOKEN);
      localStorage.removeItem(LOCALSTORAGE_KEYS.USERINFO);
      hashHistory.replace('/login');
    },
    setLoadding(state, payload: boolean) {
      state.loadding = payload;
    }
  },
  effects: {
    async login(params: LoginParams) {
      try {
        dispatch('setLoadding', true);
        const res = await api.auth.login(params);
        dispatch('setUserInfo', res);
        setCookie(COOKIE_KEYS.TOKEN, res.token);
        localStorage.setItem(LOCALSTORAGE_KEYS.USERINFO, JSON.stringify(res));
        hashHistory.replace('/');
      } catch (err) {
        console.error(err);
      }
      dispatch('setLoadding', false);
    }
  }
});

export const AuthStore = { useStore, dispatch };
