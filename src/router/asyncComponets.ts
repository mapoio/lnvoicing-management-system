import Loadable from 'react-loadable';

import PageLoading from '@components/PageLoading';

const loadComponent = (loader: () => Promise<any>) =>
  Loadable({
    loader,
    loading: PageLoading
  });

export const asynchronousComponents = {
  Employee: loadComponent(() => import(/* webpackChunkName: "Employee" */ '@views/Employee')),
  Goods: loadComponent(() => import(/* webpackChunkName: "goods" */ '@views/Goods')),
  Model: loadComponent(() => import(/* webpackChunkName: "model" */ '@views/Model')),
  Brand: loadComponent(() => import(/* webpackChunkName: "brand" */ '@views/Brand')),
  Customer: loadComponent(() => import(/* webpackChunkName: "customer" */ '@views/Customer')),
  Supplier: loadComponent(() => import(/* webpackChunkName: "Supplier" */ '@views/Supplier')),
  Good: loadComponent(() => import(/* webpackChunkName: "Good" */ '@views/Good')),
  Repertory: loadComponent(() => import(/* webpackChunkName: "Repertory" */ '@views/Repertory')),
  Purchase: loadComponent(() => import(/* webpackChunkName: "Purchase" */ '@views/Purchase')),
  Resale: loadComponent(() => import(/* webpackChunkName: "Resale" */ '@views/Resale')),
  Sale: loadComponent(() => import(/* webpackChunkName: "Sale" */ '@views/Sale')),
  Stockin: loadComponent(() => import(/* webpackChunkName: "Stockin" */ '@views/Stockin')),
  Stock: loadComponent(() => import(/* webpackChunkName: "Stock" */ '@views/Stock')),
  Stockout: loadComponent(() => import(/* webpackChunkName: "Stockout" */ '@views/Stockout'))
};

export type AsynchronousComponentKeys = keyof typeof asynchronousComponents;
