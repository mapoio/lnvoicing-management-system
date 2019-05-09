import * as React from 'react';

import { Tables } from './table';
import * as styles from '@shared/style/index.scss';
import { useRouterSearch } from '@utils/index';
import { Create } from './create';
import { View } from './view';

const Main = () => {
  return (
    <>
      <div className={styles.tabHead}>
        <p>耗材进销存管理系统</p>
        <h2>退货管理</h2>
      </div>
      <div className={styles.tab}>
        <Tables />
      </div>
    </>
  );
};

interface ICreatOrView {
  batchId: string;
}

const CreatOrView = (props: ICreatOrView) => {
  const Compoment = props.batchId === 'batch' ? Create : View;
  return <Compoment batchId={props.batchId} />;
};

const Brand = () => {
  React.useEffect(() => {
    const title = '耗材进销存管理系统 - 退货单管理';
    document.title = title;
    return () => {
      document.title = '耗材进销存管理系统';
    };
  }, []);
  const batch = useRouterSearch().search.batch;
  return !!batch ? <CreatOrView batchId={batch} /> : <Main />;
};

export default Brand;
