import * as React from 'react';
import { Layout, Icon } from 'antd';

import * as styles from './index.scss';
import { GlobalStore } from '@store/global';
import { hashHistory } from '@store/router';
import { LOCALSTORAGE_KEYS } from '@constants/index';

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
          onClick={() => {
            localStorage.removeItem(LOCALSTORAGE_KEYS.AUTH);
            localStorage.removeItem(LOCALSTORAGE_KEYS.JWT);
            hashHistory.replace('/login');
          }}
        />
      </div>
    </Layout.Header>
  );
};

export default Header;
