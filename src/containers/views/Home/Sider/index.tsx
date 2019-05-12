import * as React from 'react';
import classnames from 'classnames';
import { Layout, Icon, Switch } from 'antd';
import { GlobalStore } from '@store/global';

import * as styles from './index.scss';
import SiderMenu from './Menu';

const { useStore, dispatch } = GlobalStore;

const Sider = () => {
  const { sideBarCollapsed, sideBarTheme } = useStore(s => s);
  const handleThemeChange = e => dispatch('changeSiderTheme', e ? 'dark' : 'light');
  const ChangeTheme = (
    <div className={classnames(styles.changeTheme, sideBarTheme === 'dark' && styles.dark)}>
      Switch Theme
      <Switch
        checkedChildren="dark"
        unCheckedChildren="light"
        checked={sideBarTheme === 'dark'}
        onChange={handleThemeChange}
      />
    </div>
  );
  return (
    <Layout.Sider className={styles.sider} trigger={null} theme={sideBarTheme} collapsible collapsed={sideBarCollapsed}>
      <div className={classnames(styles.logoBox, sideBarTheme === 'dark' && styles.dark)}>
        <Icon type="deployment-unit" />
      </div>
      <SiderMenu />
      {!sideBarCollapsed && ChangeTheme}
    </Layout.Sider>
  );
};

export default Sider;
