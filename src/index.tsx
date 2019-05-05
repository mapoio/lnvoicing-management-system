import './index.scss';

// import '@babel/polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hashHistory } from '@store/router';
import { Router } from 'react-router-dom';
import storeManage from 'react-state-manage';

import registerServiceWorker from './sw';
import AppRouter from '@shared/App';
import { reactStorelogger, reactStoreUpdatelogger } from '@utils/logger';

storeManage.init({
  beforeDispatchs: [reactStorelogger],
  beforeUpdates: [reactStoreUpdatelogger]
});

registerServiceWorker();

const render = Component => {
  const element = (
    <Router history={hashHistory}>
      <Component />
    </Router>
  );
  ReactDOM.render(element, document.getElementById('app') as HTMLElement);
};

render(AppRouter);
