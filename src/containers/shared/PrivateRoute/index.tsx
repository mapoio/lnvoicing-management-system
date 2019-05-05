import * as React from 'react';
import { Route } from 'react-router-dom';

import { getCookie } from '@utils/index';
import { COOKIE_KEYS } from '@constants/index';
import { hashHistory } from '@store/router';
import { AuthStore } from '@store/auth';

const useAuthStore = AuthStore.useStore;
const useEffect = React.useEffect;

const PrivateRoute = (props: any) => {
  const userInfo = useAuthStore(s => s.userInfo);
  const gotoLogin = () => {
    hashHistory.replace('/login');
  };

  const checkLocalUserInfo = () => {
    const token = getCookie(COOKIE_KEYS.TOKEN);
    if (!token) {
      return gotoLogin();
    }
    if (!userInfo) {
      try {
        AuthStore.dispatch('initUserInfo');
        // const userInfoByInit = initUserInfo()
        // if (userInfoByInit.token !== token) {
        //     throw new Error('cookie 上储存的token与localStorage 上储存的token不一致!')
        // }
      } catch (err) {
        console.warn(err);
        gotoLogin();
      }
    }
  };

  useEffect(() => {
    checkLocalUserInfo();
  }, []);

  const { component: Component, ...rest } = props;
  return <Route {...rest} render={routerProps => <Component {...routerProps} {...rest} />} />;
};

export default PrivateRoute;
