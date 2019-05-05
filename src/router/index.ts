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
    id: 2,
    title: 'ECharts',
    icon: 'bar-chart'
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
    id: 21,
    pid: 2,
    title: 'Line-Chart',
    icon: 'line-chart'
  },
  {
    id: 212,
    pid: 21,
    path: '/area-stack',
    title: 'Area-Stack',
    component: 'ChartAreaStack',
    exact: true
  },
  {
    id: 211,
    pid: 21,
    path: '/line-smooth',
    title: 'Line-Smooth',
    component: 'ChartLineSmooth',
    exact: true
  },
  {
    id: 22,
    pid: 2,
    path: '/pie-chart',
    title: 'Pie-Chart',
    icon: 'pie-chart',
    component: 'ChartPie',
    exact: true
  }
];

export default menu;
