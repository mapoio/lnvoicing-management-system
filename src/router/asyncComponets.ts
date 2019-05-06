import Loadable from 'react-loadable';

import PageLoading from '@components/PageLoading';

const loadComponent = (loader: () => Promise<any>) =>
  Loadable({
    loader,
    loading: PageLoading
  });

export const asynchronousComponents = {
  Dashboard: loadComponent(() => import(/* webpackChunkName: "dashboard" */ '@views/Dashboard')),
  ChartAreaStack: loadComponent(() => import(/* webpackChunkName: "chart-area-stack" */ '@views/Charts/AreaStack')),
  ChartLineSmooth: loadComponent(() => import(/* webpackChunkName: "chart-line-smooth" */ '@views/Charts/LineSmooth')),
  ChartPie: loadComponent(() => import(/* webpackChunkName: "chart-pie" */ '@views/Charts/Pie')),
  Goods: loadComponent(() => import(/* webpackChunkName: "goods" */ '@views/Goods')),
  Model: loadComponent(() => import(/* webpackChunkName: "model" */ '@views/Model')),
  Brand: loadComponent(() => import(/* webpackChunkName: "brand" */ '@views/Brand')),
  Customer: loadComponent(() => import(/* webpackChunkName: "customer" */ '@views/Customer'))
};

export type AsynchronousComponentKeys = keyof typeof asynchronousComponents;
