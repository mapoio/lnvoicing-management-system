import * as React from 'react';
import { Menu, Icon } from 'antd';
import pathToRegexp from 'path-to-regexp';

import * as styles from './index.scss';
import menu, { IMenu, IMenuInTree } from './../menu';
import { arrayToTree, queryArray } from '@utils/index';
import { hashHistory } from '@store/router';
import { GlobalStore } from '@store/global';
import { AuthStore } from '@store/auth';
import { Employee, EmployeeRole } from '@services/gql/employee';

const { SubMenu } = Menu;
const useGlobalStore = GlobalStore.useStore;

const useMenuState = () => {
  const { sideBarTheme, sideBarCollapsed, navOpenKeys } = useGlobalStore(s => s);
  const user = AuthStore.useStore(s => s.auth.user.employee) as Employee;
  return {
    sideBarTheme,
    sideBarCollapsed,
    navOpenKeys,
    user
  };
};

const checkRole = (needRole: EmployeeRole, currlyRole: EmployeeRole) => {
  if (!needRole) {
    return true;
  } else if (currlyRole === EmployeeRole.ADMIN) {
    return true;
  } else if (currlyRole === needRole) {
    return true;
  } else {
    return false;
  }
};

const SiderMenu = () => {
  const { sideBarTheme, sideBarCollapsed, navOpenKeys, user } = useMenuState();

  // 打开的菜单层级记录
  const levelMap: NumberObject = {};

  const menuTree = arrayToTree<IMenuInTree>(menu, 'id', 'pid');

  const goto = ({ key }: { key: string }) => {
    const selectedMenu = menu.find(item => String(item.id) === key);
    if (selectedMenu && selectedMenu.path && selectedMenu.path !== hashHistory.location.pathname) {
      hashHistory.push(selectedMenu.path);
    }
  };

  const onOpenChange = (openKeys: string[]): void => {
    const latestOpenKey = openKeys.find(key => !navOpenKeys.includes(key));
    const latestCloseKey = navOpenKeys.find(key => !openKeys.includes(key));
    let nextOpenKeys: string[] = [];
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey);
    }
    GlobalStore.dispatch('setOpenKeys', openKeys);
  };

  const menuProps = {
    get menuProps() {
      return !sideBarCollapsed
        ? {
            onOpenChange: onOpenChange,
            openKeys: navOpenKeys
          }
        : {};
    }
  }.menuProps;

  const getPathArray = (array: IMenu[], current: IMenu): string[] => {
    const result = [String(current.id)];
    const getPath = (item: IMenu): void => {
      if (item && item.pid) {
        result.unshift(String(item.pid));
        getPath(queryArray(array, String(item.pid), 'id'));
      }
    };
    getPath(current);
    return result;
  };

  // 保持选中
  const getAncestorKeys = (key: string): string[] => {
    const map = {};
    const getParent = (index: string) => {
      const result = [String(levelMap[index])];
      if (levelMap[result[0]]) {
        result.unshift(getParent(result[0])[0]);
      }
      return result;
    };
    for (const index in levelMap) {
      if ({}.hasOwnProperty.call(levelMap, index)) {
        map[index] = getParent(index);
      }
    }
    return map[key] || [];
  };

  // 递归生成菜单
  const getMenus = (menuTrees: IMenuInTree[]) => {
    return menuTrees.map(item => {
      if (!checkRole(item.role, user.role)) {
        return null;
      }
      if (item.children) {
        if (item.pid) {
          levelMap[item.id] = item.pid;
        }
        return (
          <SubMenu
            key={String(item.id)}
            title={
              <span>
                {item.icon && <Icon type={item.icon} />}
                <span>{item.title}</span>
              </span>
            }
          >
            {getMenus(item.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={String(item.id)}>
          {item.icon && <Icon type={item.icon} />}
          <span>{item.title}</span>
        </Menu.Item>
      );
    });
  };

  const menuItems = getMenus(menuTree);
  // 寻找选中路由
  let currentMenu: IMenu = null;
  for (const item of menu) {
    if (item.path && pathToRegexp(item.path).exec(hashHistory.location.pathname)) {
      currentMenu = item;
      break;
    }
  }
  let selectedKeys: string[] = null;
  if (currentMenu) {
    selectedKeys = getPathArray(menu, currentMenu);
  }
  if (!selectedKeys) {
    selectedKeys = ['1'];
  }
  return (
    <Menu
      className={styles.menu}
      theme={sideBarTheme}
      mode="inline"
      selectedKeys={selectedKeys}
      onClick={goto}
      {...menuProps}
    >
      {menuItems}
    </Menu>
  );
};

export default SiderMenu;
