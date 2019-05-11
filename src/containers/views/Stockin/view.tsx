import React, { useEffect } from 'react';
import * as styles from '@shared/style/index.scss';
import { StockinStore } from '@store/stockin';
import { Row, Col, Divider, Table, Tag } from 'antd';
import { Stockin, stockinStatus } from '@services/gql/stockin';
import { formatTime, searchItem } from '@utils/index';
import { Purchase } from '@services/gql/purchase';
import { columns as PurchaseCol } from '@views/Purchase/table';
import { columns as ResaleCol } from '@views/Resale/table';
import { Repertory } from '@services/gql/repertory';
import { Resale } from '@services/gql/resale';
import { ColumnProps } from 'antd/lib/table';
import { Purchaseitem } from '@services/gql/purchaseitem';
import { Resaleitem } from '@services/gql/resaleitem';
import { Stock } from '@services/gql/stock';

const statusOption = {
  [stockinStatus.ACTIVE]: '有效',
  [stockinStatus.INACTIVE]: '无效'
};

interface IRepertoryShow {
  repertory: Repertory;
}

const RepertoryShow = (props: IRepertoryShow) => {
  const repertory = props.repertory;
  return (
    <div className={styles.contentCard}>
      <h3 className={styles.titleCard}>仓库</h3>
      <Row gutter={16}>
        <Col className={styles.itemCard} span={8}>
          ID：{repertory.id}
        </Col>
        <Col className={styles.itemCard} span={8}>
          名称：{repertory.name}
        </Col>
        <Col className={styles.itemCard} span={8}>
          地址：{repertory.address}
        </Col>
        <Col className={styles.itemCard} span={8}>
          联系人姓名：{repertory.manageName}
        </Col>
        <Col className={styles.itemCard} span={8}>
          联系人电话：{repertory.managePhone}
        </Col>
        <Col className={styles.itemCard} span={8}>
          更新时间：{formatTime(repertory.updated_at)}
        </Col>
        <Col className={styles.itemCard} span={8}>
          创建时间：{formatTime(repertory.created_at)}
        </Col>
      </Row>
    </div>
  );
};

interface IStockinShow {
  stockin: Stockin;
}

const UpdateStockinShow = (props: IStockinShow) => {
  const stockin = props.stockin;
  return (
    <Row gutter={16}>
      <Col span={16}>
        <Row>
          <Col className={styles.headCardItem} span={12}>
            ID：{stockin.id}
          </Col>
          <Col className={styles.headCardItem} span={12}>
            备注：{stockin.remark}
          </Col>
          <Col className={styles.headCardItem} span={12}>
            更新时间：{formatTime(stockin.updated_at)}
          </Col>
          <Col className={styles.headCardItem} span={12}>
            创建时间：{formatTime(stockin.created_at)}
          </Col>
        </Row>
      </Col>
      <Col className={`${styles.headCardItem} ${styles.end}`} span={6} offset={2}>
        <div className={styles.rightCard}>
          <p>状态</p>
          <h2>{statusOption[stockin.status]}</h2>
        </div>
      </Col>
    </Row>
  );
};

const tmpCol = [...PurchaseCol];
tmpCol.pop();
tmpCol.splice(2, 1);
const purchaseColumns = tmpCol;

interface IPurchaseShow {
  purchases: Purchase[];
}
export const PurchaseTables = (props: IPurchaseShow) => {
  const list = props.purchases;
  return (
    <div className={styles.contentCard}>
      <h3 className={styles.titleCard}>采购单</h3>
      <Table<Purchase> dataSource={list} columns={purchaseColumns} rowKey={r => `${r.id}`} pagination={false} />
    </div>
  );
};

const resaleTmpCol = [...ResaleCol];
resaleTmpCol.pop();
resaleTmpCol.splice(2, 1);
const resalesColumns = resaleTmpCol;

interface IResaleShow {
  resales: Resale[];
}
export const ResaleTables = (props: IResaleShow) => {
  const list = props.resales;
  return (
    <div className={styles.contentCard}>
      <h3 className={styles.titleCard}>退货单</h3>
      <Table<Resale> dataSource={list} columns={resalesColumns} rowKey={r => `${r.id}`} pagination={false} />
    </div>
  );
};

const goodsColumns: Array<ColumnProps<Purchaseitem | Resaleitem>> = [
  {
    title: '唯一ID',
    dataIndex: 'id'
  },
  {
    title: '品牌',
    dataIndex: 'good.brand.name'
  },
  {
    title: '类型',
    dataIndex: 'good.model.name'
  },
  {
    title: '花纹',
    dataIndex: 'good.pattern'
  },
  {
    title: '载重指数',
    dataIndex: 'good.loadIndex'
  },
  {
    title: '规格',
    dataIndex: 'good.specification'
  },
  {
    title: '单位',
    dataIndex: 'good.unit'
  },
  {
    title: '速度级别',
    dataIndex: 'good.speedLevel'
  },
  {
    title: '制造厂商',
    dataIndex: 'good.brand.manufacturer'
  },
  {
    title: '数量',
    dataIndex: 'amount'
  },
  {
    width: 300,
    title: '商品识别码',
    dataIndex: 'stocks',
    render: (stocks: Stock[]) => {
      return (
        <>
          {stocks.map(item => (
            <Tag key={item.id}>{item.goodsCode}</Tag>
          ))}
        </>
      );
    }
  }
];

interface IGoodsShow {
  record: Stockin;
}
export const Tables = (props: IGoodsShow) => {
  const list: Array<Array<Purchaseitem | Resaleitem>> = props.record.purchases.map(item => item.purchaseitems);
  const goodsList = list.concat(props.record.resales.map(item => item.resaleitems)).reduce((p, s) => p.concat(s), []);
  return (
    <div className={styles.contentCard}>
      <h3 className={styles.titleCard}>商品项</h3>
      <Table<Purchaseitem | Resaleitem>
        dataSource={goodsList}
        columns={goodsColumns}
        rowKey={r => `${r.id}`}
        pagination={false}
      />
    </div>
  );
};

interface IView {
  batchId: string;
}

export const View = (props: IView) => {
  const stockins = StockinStore.useStore(s => s).list;
  useEffect(() => {
    if (stockins.length < 1) {
      StockinStore.dispatch('getList', 500);
    }
    return () => false;
  }, []);
  const stockin = searchItem(props.batchId, stockins).data;
  if (!stockin) {
    return <h2>不存在此单号入库单</h2>;
  }
  return (
    <>
      <div className={styles.tabHead}>
        <p>
          耗材进销存管理系统 / <a href="#/repertory/stockin">入库管理</a>
        </p>
        <h2>{stockin.batch}</h2>
        <UpdateStockinShow stockin={stockin} />
      </div>
      <div className={styles.tab}>
        <RepertoryShow repertory={stockin.repertory} />
        {stockin.purchases.length > 0 ? (
          <>
            <Divider className={styles.cardDivider} />
            <PurchaseTables purchases={stockin.purchases} />
          </>
        ) : null}
        {stockin.resales.length > 0 ? (
          <>
            <Divider className={styles.cardDivider} />
            <ResaleTables resales={stockin.resales} />
          </>
        ) : null}
        <Tables record={stockin} />
      </div>
    </>
  );
};
