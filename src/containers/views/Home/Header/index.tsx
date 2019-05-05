import * as React from 'react';
import { Layout, Icon } from 'antd';

import * as styles from './index.scss';
import { AuthStore } from '@store/auth';
import { GlobalStore } from '@store/global';

const useGlobalStore = GlobalStore.useStore;

const Header = () => {
  const { sideBarCollapsed } = useGlobalStore(s => s);
  return (
    <Layout.Header className={styles.header}>
      <Icon
        className={styles.trigger}
        type={sideBarCollapsed ? 'menu-unfold' : 'menu-fold'}
        onClick={() => GlobalStore.dispatch('toggleSideBarCollapsed')}
      />
      <div className={styles.right}>
        <Icon
          className={styles.rightIcon}
          type="logout"
          theme="outlined"
          onClick={() => AuthStore.dispatch('logout')}
        />
      </div>
    </Layout.Header>
  );
};

export default Header;
