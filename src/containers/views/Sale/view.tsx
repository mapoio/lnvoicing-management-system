import React, { useEffect } from 'react';
import * as styles from '@shared/style/index.scss';
import { SaleStore } from '@store/sale';
import { Row, Col, Divider, Table } from 'antd';
import { Sale, saleStatus } from '@services/gql/sale';
import { formatTime, searchItem } from '@utils/index';
import { Customer } from '@services/gql/customer';
import { Saleitem } from '@services/gql/saleitem';
import { ColumnProps } from 'antd/lib/table';

const statusOption = {
  [saleStatus.BUILDED]: '已建立',
  [saleStatus.CONFIRM]: '已确认',
  [saleStatus.INVAILD]: '无效',
  [saleStatus.STOCKOUT]: '已出库'
};

interface ISaleShow {
  sale: Sale;
}

const UpdateSaleShow = (props: ISaleShow) => {
  const sale = props.sale;
  return (
    <Row gutter={16}>
      <Col span={16}>
        <Row>
          <Col className={styles.headCardItem} span={12}>
            ID：{sale.id}
          </Col>
          <Col className={styles.headCardItem} span={12}>
            备注：{sale.remark}
          </Col>
          <Col className={styles.headCardItem} span={12}>
            更新时间：{formatTime(sale.updated_at)}
          </Col>
          <Col className={styles.headCardItem} span={12}>
            创建时间：{formatTime(sale.created_at)}
          </Col>
        </Row>
      </Col>
      <Col className={`${styles.headCardItem} ${styles.end}`} span={6} offset={2}>
        <div className={styles.rightCard}>
          <p>状态</p>
          <h2>{statusOption[sale.status]}</h2>
        </div>
        <div className={styles.rightCard}>
          <p>金额</p>
          <h2>￥{sale.money}</h2>
        </div>
      </Col>
    </Row>
  );
};

const columns: Array<ColumnProps<Saleitem>> = [
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

interface ISaleitemShow {
  saleitems: Saleitem[];
}
export const Tables = (props: ISaleitemShow) => {
  const list = props.saleitems;
  return (
    <div className={styles.contentCard}>
      <h3 className={styles.titleCard}>销售项</h3>
      <Table<Saleitem> dataSource={list} columns={columns} rowKey={r => `${r.id}`} pagination={false} />
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
  const sales = SaleStore.useStore(s => s).list;
  useEffect(() => {
    if (sales.length < 1) {
      SaleStore.dispatch('getList', 500);
    }
    return () => false;
  }, []);
  const sale = searchItem(props.batchId, sales).data;
  if (!sale) {
    return <h2>不存在此单号销售单</h2>;
  }
  const customer = sale.customer;
  return (
    <>
      <div className={styles.tabHead}>
        <p>
          耗材进销存管理系统 / <a href="#/sale">销售管理</a>
        </p>
        <h2>{sale.batch}</h2>
        <UpdateSaleShow sale={sale} />
      </div>
      <div className={styles.tab}>
        <CustomerShow customer={customer} />
        <Divider className={styles.cardDivider} />
        <Tables saleitems={sale.saleitems} />
      </div>
    </>
  );
};
