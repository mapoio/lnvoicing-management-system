import React, { useState } from 'react';
import * as styles from '@shared/style/index.scss';
import { PurchaseStore } from '@store/purchase';
import { Row, Col, Divider, Table, InputNumber, Button, message, Input, Tooltip } from 'antd';
import { formatTime, searchItem } from '@utils/index';
import { Supplier } from '@services/gql/supplier';
import { Purchaseitem } from '@services/gql/purchaseitem';
import { ColumnProps } from 'antd/lib/table';
import { SupplierSelect } from '@views/Supplier/service';
import { GoodSelect } from '@views/Good/service';
import { hashHistory } from '@store/router';

const { TextArea } = Input;

const columns: Array<ColumnProps<Purchaseitem>> = [
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

interface ISupplierShow {
  supplier: Supplier;
}

const SupplierShow = (props: ISupplierShow) => {
  const supplier = props.supplier;
  return (
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
  );
};

interface ICreatOrView {
  batchId: string;
}

export const Create = (props: ICreatOrView) => {
  const [supplier, setSupplier] = useState({} as Supplier);
  const [purchaseItem, setPurchaseItem] = useState({} as Purchaseitem);
  const [purchaseitems, setPurchaseItems] = useState([] as Purchaseitem[]);
  const [remark, setRemark] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const onCreate = async () => {
    if (!supplier.id) {
      message.error('请选择供应商');
      return null;
    } else if (purchaseitems.length < 1) {
      message.error('请添加采购项');
      return null;
    }
    const data = {
      supplier,
      purchaseitems,
      remark
    };
    setCreateLoading(true);
    const warn = message.loading('正在创建采购单中，请勿关闭', 0);
    try {
      await PurchaseStore.dispatch('create', data);
      message.success('成功');
      hashHistory.push('/purchase');
    } catch (e) {
      setCreateLoading(false);
      message.error(e.message);
    } finally {
      warn();
    }
  };
  const removePurchaseItem = (index: number) => {
    const items = [...purchaseitems];
    items.splice(index - 1, 1);
    setPurchaseItems(items);
  };
  const addPurchaseItem = () => {
    if (!purchaseItem.good || !purchaseItem.amount || !purchaseItem.price) {
      message.warn('添加采购项失败，请选择完整的商品信息和采购数量与价格');
      return null;
    }
    const index = searchItem(purchaseItem.good.id, purchaseitems.map(item => item.good)).index;
    if (index > -1) {
      const item = purchaseitems.concat([]);
      item[index] = purchaseItem;
      message.warn('添加了相同商品项，已默认覆盖');
      setPurchaseItems(item);
      return null;
    }
    setPurchaseItems(purchaseitems.concat([purchaseItem]));
  };
  const col = columns.concat([
    {
      key: 'good.id',
      title: '操作',
      render: (_, _a, index) => {
        return (
          <Tooltip title="删除本条数据">
            <Button icon="delete" type="danger" shape="circle" onClick={() => removePurchaseItem(index)} />
          </Tooltip>
        );
      }
    }
  ]);
  return (
    <>
      <div className={styles.tabHead}>
        <p>
          耗材进销存管理系统 / <a href="#/purchase">销售管理</a>
        </p>
        <h2>创建采购单</h2>
      </div>
      <div className={styles.tab}>
        <div className={styles.contentCard}>
          <h3 className={styles.titleCard}>
            选择供应商：
            <SupplierSelect supplier={supplier} setSupplier={setSupplier} active={true} />
          </h3>
          {supplier.id ? <SupplierShow supplier={supplier} /> : null}
        </div>
        <Divider className={styles.cardDivider} />
        <div className={styles.contentCard}>
          <h3 className={styles.titleCard}>添加采购项</h3>
          <div>
            商品：
            <GoodSelect
              good={purchaseItem.good}
              setGood={good => setPurchaseItem(Object.assign({}, purchaseItem, { good }))}
              active={true}
            />
            <Divider type="vertical" />
            单位价格：
            <InputNumber
              step={0.01}
              value={purchaseItem.price}
              onChange={price => setPurchaseItem(Object.assign({}, purchaseItem, { price }))}
            />
            <Divider type="vertical" />
            采购数量：
            <InputNumber
              min={1}
              value={purchaseItem.amount}
              onChange={amount => setPurchaseItem(Object.assign({}, purchaseItem, { amount }))}
            />
            <Divider type="vertical" />
            <Button onClick={addPurchaseItem}>添加采购项</Button>
          </div>
          <Table<Purchaseitem>
            dataSource={purchaseitems}
            columns={col}
            rowKey={r => `${r.amount}=${r.price}=${r.good.id}`}
            pagination={false}
          />
          <div className={styles.totalBox}>
            <div className={styles.total}>
              <p>
                总数量：<span>{purchaseitems.reduce((total, item) => (total += item.amount), 0)}</span>
              </p>
              <p>
                总价格：<span>{purchaseitems.reduce((total, item) => (total += item.price * item.amount), 0)}</span>
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
          <Button type="default" onClick={() => hashHistory.push('/purchase')}>
            返回
          </Button>
        </div>
      </div>
    </>
  );
};
