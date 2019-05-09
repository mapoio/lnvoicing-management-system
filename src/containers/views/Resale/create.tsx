import React, { useEffect, useState } from 'react';
import * as styles from '@shared/style/index.scss';
import { ResaleStore } from '@store/resale';
import { Row, Col, Divider, Table, InputNumber, Button, message, Input, Tooltip } from 'antd';
import { formatTime, searchItem } from '@utils/index';
import { Customer } from '@services/gql/customer';
import { Resaleitem } from '@services/gql/resaleitem';
import { ColumnProps } from 'antd/lib/table';
import { CustomerSelect } from '@views/Customer/service';
import { GoodSelect } from '@views/Good/service';
import { hashHistory } from '@store/router';

const { TextArea } = Input;

const columns: Array<ColumnProps<Resaleitem>> = [
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
  }
];

interface ICustomerShow {
  customer: Customer;
}

const CustomerShow = (props: ICustomerShow) => {
  const customer = props.customer;
  return (
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
  );
};

interface ICreatOrView {
  batchId: string;
}

export const Create = (props: ICreatOrView) => {
  const [customer, setCustomer] = useState({} as Customer);
  const [resaleItem, setResaleItem] = useState({} as Resaleitem);
  const [resaleitems, setResaleItems] = useState([] as Resaleitem[]);
  const [remark, setRemark] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const onCreate = async () => {
    if (!customer.id) {
      message.error('请选择客户');
      return null;
    } else if (resaleitems.length < 1) {
      message.error('请添加退货项');
      return null;
    }
    const data = {
      customer,
      resaleitems,
      remark
    };
    setCreateLoading(true);
    const warn = message.loading('正在创建退货单中，请勿关闭', 0);
    try {
      await ResaleStore.dispatch('create', data);
      message.success('成功');
      hashHistory.push('/resale');
    } catch (e) {
      setCreateLoading(false);
      message.error(e.message);
    } finally {
      warn();
    }
  };
  const removeResaleItem = (index: number) => {
    const items = [...resaleitems];
    items.splice(index - 1, 1);
    setResaleItems(items);
  };
  const addResaleItem = () => {
    if (!resaleItem.good || !resaleItem.amount || !resaleItem.price) {
      message.warn('添加退货项失败，请选择完整的商品信息和退货数量与价格');
      return null;
    }
    const index = searchItem(resaleItem.good.id, resaleitems.map(item => item.good)).index;
    if (index > -1) {
      const item = resaleitems.concat([]);
      item[index] = resaleItem;
      message.warn('添加了相同商品项，已默认覆盖');
      setResaleItems(item);
      return null;
    }
    setResaleItems(resaleitems.concat([resaleItem]));
  };
  const col = columns.concat([
    {
      key: 'good.id',
      title: '操作',
      render: (_, _a, index) => {
        return (
          <Tooltip title="删除本条数据">
            <Button icon="delete" type="danger" shape="circle" onClick={() => removeResaleItem(index)} />
          </Tooltip>
        );
      }
    }
  ]);
  return (
    <>
      <div className={styles.tabHead}>
        <p>
          耗材进销存管理系统 / <a href="#/resale">退货管理</a>
        </p>
        <h2>创建退货单</h2>
      </div>
      <div className={styles.tab}>
        <div className={styles.contentCard}>
          <h3 className={styles.titleCard}>
            选择客户：
            <CustomerSelect customer={customer} setCustomer={setCustomer} active={true} />
          </h3>
          {customer.id ? <CustomerShow customer={customer} /> : null}
        </div>
        <Divider className={styles.cardDivider} />
        <div className={styles.contentCard}>
          <h3 className={styles.titleCard}>添加退货项</h3>
          <div>
            商品：
            <GoodSelect
              good={resaleItem.good}
              setGood={good => setResaleItem(Object.assign({}, resaleItem, { good }))}
              active={true}
            />
            <Divider type="vertical" />
            单位价格：
            <InputNumber
              step={0.01}
              value={resaleItem.price}
              onChange={price => setResaleItem(Object.assign({}, resaleItem, { price }))}
            />
            <Divider type="vertical" />
            退货数量：
            <InputNumber
              min={1}
              value={resaleItem.amount}
              onChange={amount => setResaleItem(Object.assign({}, resaleItem, { amount }))}
            />
            <Divider type="vertical" />
            <Button onClick={addResaleItem}>添加退货项</Button>
          </div>
          <Table<Resaleitem>
            dataSource={resaleitems}
            columns={col}
            rowKey={r => `${r.amount}=${r.price}=${r.good.id}`}
            pagination={false}
          />
          <div className={styles.totalBox}>
            <div className={styles.total}>
              <p>
                总数量：<span>{resaleitems.reduce((total, item) => (total += item.amount), 0)}</span>
              </p>
              <p>
                总价格：<span>{resaleitems.reduce((total, item) => (total += item.price * item.amount), 0)}</span>
              </p>
            </div>
          </div>
        </div>
        <Divider className={styles.cardDivider} />
        <div className={styles.contentCard}>
          <h3 className={styles.titleCard}>备注</h3>
          <TextArea value={remark} onChange={e => setRemark(e.target.value)} rows={4} />
        </div>
        <div className={styles.confirmBox}>
          <Button type="primary" loading={createLoading} onClick={onCreate}>
            提交
          </Button>
          <Button type="default" onClick={() => hashHistory.push('/resale')}>
            返回
          </Button>
        </div>
      </div>
    </>
  );
};
