import * as React from 'react';

import * as styles from './index.scss';
import { Tables } from './table';

const Goods = () => {
  React.useEffect(() => {
    const title = '耗材进销存管理系统 - 商品管理';
    document.title = title;
    return () => {
      document.title = '耗材进销存管理系统';
    };
  }, []);
  return (
    <>
      <div className={styles.tabHead}>
        <p>耗材进销存管理系统</p>
        <h2>商品管理</h2>
      </div>
      <div className={styles.goods}>
        <Tables />
      </div>
    </>
  );
};

export default Goods;
