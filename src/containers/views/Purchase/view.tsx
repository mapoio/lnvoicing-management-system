import React, { useEffect } from 'react';
import * as styles from '@shared/style/index.scss';
import { PurchaseStore } from '@store/purchase';
import { Row, Col, Divider, Table } from 'antd';
import { Purchase, purchaseStatus } from '@services/gql/purchase';
import { formatTime, searchItem } from '@utils/index';
import { Supplier } from '@services/gql/supplier';
import { Purchaseitem } from '@services/gql/purchaseitem';
import { ColumnProps } from 'antd/lib/table';

const statusOption = {
  [purchaseStatus.BUILDED]: '已建立',
  [purchaseStatus.CONFIRM]: '已确认',
  [purchaseStatus.INVAILD]: '无效',
  [purchaseStatus.STOCKIN]: '已入库'
};

interface IPurchaseShow {
  purchase: Purchase;
}

const UpdatePurchaseShow = (props: IPurchaseShow) => {
  const purchase = props.purchase;
  return (
    <Row gutter={16}>
      <Col span={16}>
        <Row>
          <Col className={styles.headCardItem} span={12}>
            ID：{purchase.id}
          </Col>
          <Col className={styles.headCardItem} span={12}>
            备注：{purchase.remark}
          </Col>
          <Col className={styles.headCardItem} span={12}>
            更新时间：{formatTime(purchase.updated_at)}
          </Col>
          <Col className={styles.headCardItem} span={12}>
            创建时间：{formatTime(purchase.created_at)}
          </Col>
        </Row>
      </Col>
      <Col className={`${styles.headCardItem} ${styles.end}`} span={6} offset={2}>
        <div className={styles.rightCard}>
          <p>状态</p>
          <h2>{statusOption[purchase.status]}</h2>
        </div>
        <div className={styles.rightCard}>
          <p>金额</p>
          <h2>￥{purchase.money}</h2>
        </div>
      </Col>
    </Row>
  );
};

const columns: Array<ColumnProps<Purchaseitem>> = [
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
    title: '价格',
    dataIndex: 'price'
  },
  {
    title: '数量',
    dataIndex: 'amount'
  },
  {
    title: '更新时间',
    dataIndex: 'created_at',
    render: formatTime
  },
  {
    title: '创建时间',
    dataIndex: 'updated_at',
    render: formatTime
  }
];

interface IPurchaseitemShow {
  purchaseitems: Purchaseitem[];
}
export const Tables = (props: IPurchaseitemShow) => {
  const list = props.purchaseitems;
  return (
    <div className={styles.contentCard}>
      <h3 className={styles.titleCard}>采购项</h3>
      <Table<Purchaseitem> dataSource={list} columns={columns} rowKey={r => `${r.id}`} pagination={false} />
    </div>
  );
};

interface ISupplierShow {
  supplier: Supplier;
}

const SupplierShow = (props: ISupplierShow) => {
  const supplier = props.supplier;
  return (
    <div className={styles.contentCard}>
      <h3 className={styles.titleCard}>供应商</h3>
      <Row gutter={16}>
        <Col className={styles.itemCard} span={8}>
          ID：{supplier.id}
        </Col>
        <Col className={styles.itemCard} span={8}>
          名称：{supplier.name}
        </Col>
        <Col className={styles.itemCard} span={8}>
          地址：{supplier.address}
        </Col>
        <Col className={styles.itemCard} span={8}>
          电话：{supplier.phone}
        </Col>
        <Col className={styles.itemCard} span={8}>
          联系人姓名：{supplier.manageName}
        </Col>
        <Col className={styles.itemCard} span={8}>
          联系人电话：{supplier.managePhone}
        </Col>
        <Col className={styles.itemCard} span={8}>
          更新时间：{formatTime(supplier.updated_at)}
        </Col>
        <Col className={styles.itemCard} span={8}>
          创建时间：{formatTime(supplier.created_at)}
        </Col>
      </Row>
    </div>
  );
};

interface IView {
  batchId: string;
}

export const View = (props: IView) => {
  const purchases = PurchaseStore.useStore(s => s).list;
  useEffect(() => {
    if (purchases.length < 1) {
      PurchaseStore.dispatch('getList', 500);
    }
    return () => false;
  }, []);
  const purchase = searchItem(props.batchId, purchases).data;
  if (!purchase) {
    return <h2>不存在此单号采购单</h2>;
  }
  const supplier = purchase.supplier;
  return (
    <>
      <div className={styles.tabHead}>
        <p>
          耗材进销存管理系统 / <a href="#/purchase">销售管理</a>
        </p>
        <h2>{purchase.batch}</h2>
        <UpdatePurchaseShow purchase={purchase} />
      </div>
      <div className={styles.tab}>
        <SupplierShow supplier={supplier} />
        <Divider className={styles.cardDivider} />
        <Tables purchaseitems={purchase.purchaseitems} />
      </div>
    </>
  );
};
