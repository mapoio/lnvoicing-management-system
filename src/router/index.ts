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
    component: 'Good',
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
  },
  {
    id: 5,
    path: '/supplier',
    title: '供应商管理',
    icon: 'shop',
    component: 'Supplier',
    exact: true
  },
  {
    id: 6,
    title: '库存管理',
    icon: 'layout'
  },
  {
    id: 61,
    pid: 6,
    path: '/repertory/repertory',
    title: '仓库管理',
    icon: 'database',
    component: 'Repertory',
    exact: true
  },
  {
    id: 62,
    pid: 6,
    path: '/repertory/stockin',
    title: '入库管理',
    icon: 'database',
    component: 'Stockin',
    exact: true
  },
  {
    id: 63,
    pid: 6,
    path: '/repertory/stock',
    title: '库存管理',
    icon: 'database',
    component: 'Stock',
    exact: true
  },
  {
    id: 7,
    path: '/purchase',
    title: '采购管理',
    icon: 'rise',
    component: 'Purchase',
    exact: true
  },
  {
    id: 8,
    path: '/resale',
    title: '退货管理',
    icon: 'fall',
    component: 'Resale',
    exact: true
  },
  {
    id: 9,
    path: '/sale',
    title: '销售管理',
    icon: 'barcode',
    component: 'Sale',
    exact: true
  }
];

export default menu;
