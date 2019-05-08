import * as React from 'react';

import { Tables } from './table';
import * as styles from '@shared/style/index.scss';

const Brand = () => {
  React.useEffect(() => {
    const title = '耗材进销存管理系统 - 仓库管理';
    document.title = title;
    return () => {
      document.title = '耗材进销存管理系统';
    };
  }, []);
  return (
    <>
      <div className={styles.tabHead}>
        <p>耗材进销存管理系统</p>
        <h2>仓库管理</h2>
      </div>
      <div className={styles.tab}>
        <Tables />
      </div>
    </>
  );
};

export default Brand;
