import * as React from 'react';
import { Route } from 'react-router-dom';

import { LOCALSTORAGE_KEYS } from '@constants/index';
import { hashHistory } from '@store/router';
import { AuthStore } from '@store/auth';

const useEffect = React.useEffect;

const PrivateRoute = (props: any) => {
  const user = AuthStore.useStore(s => s);
  const gotoLogin = () => {
    hashHistory.replace('/login');
  };

  const checkLocalUserInfo = () => {
    const token = localStorage.getItem(LOCALSTORAGE_KEYS.JWT);
    if (!token) {
      return gotoLogin();
    }
    try {
      AuthStore.dispatch('initUserInfo');
    } catch (err) {
      console.warn(err);
      gotoLogin();
    }
  };

  useEffect(() => {
    checkLocalUserInfo();
  }, []);

  const { component: Component, ...rest } = props;
  return <Route {...rest} render={routerProps => <Component {...routerProps} {...rest} />} />;
};

export default PrivateRoute;
