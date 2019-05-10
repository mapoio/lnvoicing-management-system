import React, { useEffect } from 'react';
import * as styles from '@shared/style/index.scss';
import { ResaleStore } from '@store/resale';
import { Row, Col, Divider, Table } from 'antd';
import { Resale, resaleStatus } from '@services/gql/resale';
import { formatTime, searchItem } from '@utils/index';
import { Customer } from '@services/gql/customer';
import { Resaleitem } from '@services/gql/resaleitem';
import { ColumnProps } from 'antd/lib/table';

const statusOption = {
  [resaleStatus.BUILDED]: '已建立',
  [resaleStatus.CONFIRM]: '已确认',
  [resaleStatus.INVAILD]: '无效',
  [resaleStatus.STOCKIN]: '已入库'
};

interface IResaleShow {
  resale: Resale;
}

const UpdateResaleShow = (props: IResaleShow) => {
  const resale = props.resale;
  return (
    <Row gutter={16}>
      <Col span={16}>
        <Row>
          <Col className={styles.headCardItem} span={12}>
            ID：{resale.id}
          </Col>
          <Col className={styles.headCardItem} span={12}>
            备注：{resale.remark}
          </Col>
          <Col className={styles.headCardItem} span={12}>
            更新时间：{formatTime(resale.updated_at)}
          </Col>
          <Col className={styles.headCardItem} span={12}>
            创建时间：{formatTime(resale.created_at)}
          </Col>
        </Row>
      </Col>
      <Col className={`${styles.headCardItem} ${styles.end}`} span={6} offset={2}>
        <div className={styles.rightCard}>
          <p>状态</p>
          <h2>{statusOption[resale.status]}</h2>
        </div>
        <div className={styles.rightCard}>
          <p>金额</p>
          <h2>￥{resale.money}</h2>
        </div>
      </Col>
    </Row>
  );
};

const columns: Array<ColumnProps<Resaleitem>> = [
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
    dataIndex: 'updated_at',
    render: formatTime
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    render: formatTime
  }
];

interface IResaleitemShow {
  resaleitems: Resaleitem[];
}
export const Tables = (props: IResaleitemShow) => {
  const list = props.resaleitems;
  return (
    <div className={styles.contentCard}>
      <h3 className={styles.titleCard}>退货项</h3>
      <Table<Resaleitem> dataSource={list} columns={columns} rowKey={r => `${r.id}`} pagination={false} />
    </div>
  );
};

interface ICustomerShow {
  customer: Customer;
}

const CustomerShow = (props: ICustomerShow) => {
  const customer = props.customer;
  return (
    <div className={styles.contentCard}>
      <h3 className={styles.titleCard}>客户</h3>
      <Row gutter={16}>
        <Col className={styles.itemCard} span={8}>
          ID：{customer.id}
        </Col>
        <Col className={styles.itemCard} span={8}>
          名称：{customer.name}
        </Col>
        <Col className={styles.itemCard} span={8}>
          地址：{customer.address}
        </Col>
        <Col className={styles.itemCard} span={8}>
          电话：{customer.phone}
        </Col>
        <Col className={styles.itemCard} span={8}>
          联系人姓名：{customer.manageName}
        </Col>
        <Col className={styles.itemCard} span={8}>
          联系人电话：{customer.managePhone}
        </Col>
        <Col className={styles.itemCard} span={8}>
          更新时间：{formatTime(customer.updated_at)}
        </Col>
        <Col className={styles.itemCard} span={8}>
          创建时间：{formatTime(customer.created_at)}
        </Col>
      </Row>
    </div>
  );
};

interface IView {
  batchId: string;
}

export const View = (props: IView) => {
  const resales = ResaleStore.useStore(s => s).list;
  useEffect(() => {
    if (resales.length < 1) {
      ResaleStore.dispatch('getList', 500);
    }
    return () => false;
  }, []);
  const resale = searchItem(props.batchId, resales).data;
  if (!resale) {
    return <h2>不存在此单号退货单</h2>;
  }
  const customer = resale.customer;
  return (
    <>
      <div className={styles.tabHead}>
        <p>
          耗材进销存管理系统 / <a href="#/resale">退货管理</a>
        </p>
        <h2>{resale.batch}</h2>
        <UpdateResaleShow resale={resale} />
      </div>
      <div className={styles.tab}>
        <CustomerShow customer={customer} />
        <Divider className={styles.cardDivider} />
        <Tables resaleitems={resale.resaleitems} />
      </div>
    </>
  );
};
