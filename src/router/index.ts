import { AsynchronousComponentKeys } from './asyncComponets';

export interface IMenu {
  title: string;
  id: number;
  pid?: number;
  path?: string;
  icon?: string;
  component?: AsynchronousComponentKeys;
  exact?: boolean;
}

export interface IMenuInTree extends IMenu {
  children?: IMenuInTree[];
}

export const menu: IMenu[] = [
  {
    id: 1,
    path: '/',
    title: '用户管理',
    icon: 'dashboard',
    component: 'Dashboard',
    exact: true
  },
  {
    id: 3,
    title: '商品管理',
    icon: 'shopping-cart'
  },
  {
    pid: 3,
    id: 31,
    title: '商品管理',
    path: '/goods/goods',
    icon: 'shopping-cart',
    component: 'Goods',
    exact: true
  },
  {
    pid: 3,
    id: 32,
    title: '类型管理',
    path: '/goods/model',
    icon: 'hdd',
    component: 'Model',
    exact: true
  },
  {
    pid: 3,
    id: 33,
    title: '品牌管理',
    path: '/goods/brand',
    icon: 'credit-card',
    component: 'Brand',
    exact: true
  },
  {
    id: 4,
    path: '/customer',
    title: '客户管理',
    icon: 'user',
    component: 'Customer',
    exact: true
  }
];

export default menu;
