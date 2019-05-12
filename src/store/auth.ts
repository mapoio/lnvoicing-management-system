import { createStore } from 'react-state-manage';
import { setCookie, clearCookie } from '@utils/index';
import { COOKIE_KEYS, LOCALSTORAGE_KEYS } from '@constants/index';
import { hashHistory } from './router';
// import Axios from 'axios';
import { HOST, GraphQLHttp } from '@utils/http';
import { User } from '@services/gql/user';
import { message } from 'antd';
import { Employee } from '@services/gql/employee';

const Axios = GraphQLHttp.HTTP;

interface IAuth {
  jwt: string;
  user: User;
}

interface LoginParams {
  account: string;
  password: string;
}

const AUTH = async (params: LoginParams) => {
  const p = {
    identifier: params.account,
    password: params.password,
    rememberMe: true
  };
  const data = await Axios.post<IAuth>(`${HOST}/auth/local`, p);
  return data.data;
};

const Info = async (id: string) => {
  const data = await Axios.get<Employee>(`${HOST}/employees/${id}`);
  return data.data;
};

export interface UserInfo {
  msg: string;
  token: string;
  category: string;
  id: string;
}

interface IState {
  userInfo: UserInfo;
  loadding: boolean;
  auth?: IAuth;
}

const initState: IState = {
  userInfo: {
    id: '1',
    msg: '',
    category: '',
    token: ''
  },
  loadding: false
};

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    initUserInfo(state) {
      const localAuth = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.AUTH)) as IAuth;
      if (!localAuth) {
        throw new Error('no local userinfo!!');
      }
      state.auth = localAuth;
      dispatch('setAuth', localAuth);
    },
    setAuth(state, auth: IAuth) {
      state.auth = auth;
      Axios.defaults.headers.Authorization = `Bearer ${auth.jwt}`;
    },
    logout() {
      localStorage.removeItem(LOCALSTORAGE_KEYS.AUTH);
      localStorage.removeItem(LOCALSTORAGE_KEYS.JWT);
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
        const res = await AUTH(params);
        const info = await Info(res.user.employee as string);
        res.user.employee = info;
        dispatch('setAuth', res);
        setCookie(COOKIE_KEYS.TOKEN, res.jwt);
        localStorage.setItem(LOCALSTORAGE_KEYS.JWT, res.jwt);
        localStorage.setItem(LOCALSTORAGE_KEYS.AUTH, JSON.stringify(res));
        hashHistory.replace('/');
      } catch (err) {
        message.error(err.message);
        console.error(err);
      }
      dispatch('setLoadding', false);
    }
  }
});

export const AuthStore = { useStore, dispatch };
