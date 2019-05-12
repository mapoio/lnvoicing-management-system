import React, { useState } from 'react';
import * as styles from '@shared/style/index.scss';
import { StockinStore } from '@store/stockin';
import { Row, Col, Divider, Table, Tag, Button, Tooltip, message } from 'antd';
import { Stockin } from '@services/gql/stockin';
import { formatTime } from '@utils/index';
import { Purchase } from '@services/gql/purchase';
import { columns as PurchaseCol } from '@views/Purchase/table';
import { columns as ResaleCol } from '@views/Resale/table';
import { Repertory } from '@services/gql/repertory';
import { Resale } from '@services/gql/resale';
import { ColumnProps } from 'antd/lib/table';
import { Stock } from '@services/gql/stock';
import { RepertorySelect } from '@views/Repertory/service';
import { ResaleSelect } from '@views/Resale/service';
import { PurchaseSelect } from '@views/Purchase/service';
import { Good } from '@services/gql/good';
import { cloneDeep } from 'lodash';
import { DynamicTag } from '@shared/util';
import TextArea from 'antd/lib/input/TextArea';
import { hashHistory } from '@store/router';

interface IRepertoryShow {
  repertory: Repertory;
}

const RepertoryShow = (props: IRepertoryShow) => {
  const repertory = props.repertory;
  return (
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
  );
};

const tmpCol = [...PurchaseCol];
tmpCol.pop();
tmpCol.splice(2, 1);
const purchaseColumns = tmpCol;

const resaleTmpCol = [...ResaleCol];
resaleTmpCol.pop();
resaleTmpCol.splice(2, 1);
const resalesColumns = resaleTmpCol;

type goodsCol = {
  id: string;
  good: Good;
  amount: number;
  stocks: Stock[] | string[];
  type?: string;
  setTag?: (tags: string[]) => void;
};

const goodsColumns: Array<ColumnProps<goodsCol>> = [
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
    title: '类型',
    dataIndex: 'type',
    render: text => <Tag color={text === '采购单' ? '#108ee9' : '#f50'}>{text}</Tag>
  },
  {
    width: 300,
    title: '商品识别码',
    dataIndex: 'stocks',
    render: (stocks: string[], record) => {
      return (
        <>
          <DynamicTag tags={stocks} setTags={record.setTag} max={record.amount} />
        </>
      );
    }
  }
];

interface IGoodsShow {
  record: Partial<Stockin>;
  setPurchases: React.Dispatch<React.SetStateAction<Purchase[]>>;
  setResales: React.Dispatch<React.SetStateAction<Resale[]>>;
}
export const Tables = (props: IGoodsShow) => {
  const list: goodsCol[][] = props.record.purchases.map((item, purchasesIndex) =>
    item.purchaseitems.map((s, purchaseitemsINdex) => ({
      ...s,
      type: '采购单',
      setTag: (tags: string[]) => {
        const data = cloneDeep(props.record.purchases);
        data[purchasesIndex].purchaseitems[purchaseitemsINdex].stocks = tags;
        props.setPurchases(data);
      }
    }))
  );
  const goodsList = list
    .concat(
      props.record.resales.map((item, resalesIndex) =>
        item.resaleitems.map((s, resaleitemsIndex) => ({
          ...s,
          type: '退货单',
          setTag: (tags: string[]) => {
            const data = cloneDeep(props.record.resales);
            data[resalesIndex].resaleitems[resaleitemsIndex].stocks = tags;
            props.setResales(data);
          }
        }))
      )
    )
    .reduce((p, s) => p.concat(s), []);
  return (
    <div className={styles.contentCard}>
      <h3 className={styles.titleCard}>商品项</h3>
      <Table<goodsCol> dataSource={goodsList} columns={goodsColumns} rowKey={r => `${r.id}`} pagination={false} />
    </div>
  );
};

interface IView {
  batchId: string;
}

export const Create = (props: IView) => {
  const [repertory, setRepertory] = useState({} as Repertory);
  const [resale, setResale] = useState({} as Resale);
  const [resales, setResales] = useState([] as Resale[]);
  const [purchase, setPurchase] = useState({} as Purchase);
  const [purchases, setPurchases] = useState([] as Purchase[]);
  const [remark, setRemark] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const removeResale = (index: number) => {
    const items = [...resales];
    items.splice(index - 1, 1);
    setResales(items);
  };
  const resalesCol = resalesColumns.concat([
    {
      key: 'customer.id',
      title: '操作',
      render: (_, _a, index) => {
        return (
          <Tooltip title="删除本条数据">
            <Button icon="delete" type="danger" shape="circle" onClick={() => removeResale(index)} />
          </Tooltip>
        );
      }
    }
  ]);
  const removePurchase = (index: number) => {
    const items = [...purchases];
    items.splice(index - 1, 1);
    setPurchases(items);
  };
  const purchasesCol = purchaseColumns.concat([
    {
      key: 'customer.id',
      title: '操作',
      render: (_, _a, index) => {
        return (
          <Tooltip title="删除本条数据">
            <Button icon="delete" type="danger" shape="circle" onClick={() => removePurchase(index)} />
          </Tooltip>
        );
      }
    }
  ]);
  const onCreate = async () => {
    if (!repertory.id) {
      message.error('请选择入库仓库');
      return null;
    } else if (purchases.length + resales.length < 1) {
      message.error('请选择采购单或退货单');
      return null;
    }
    try {
      resales.map(item => {
        item.resaleitems.map(i => {
          if (i.amount !== i.stocks.length) {
            throw new Error();
          }
        });
      });
      purchases.map(item => {
        item.purchaseitems.map(i => {
          if (i.amount !== i.stocks.length) {
            throw new Error();
          }
        });
      });
    } catch (error) {
      message.error('请按照订单数量要求补充完整的商品标识码');
      return null;
    }
    const data = {
      repertory,
      resales,
      purchases,
      remark
    };
    setCreateLoading(true);
    const warn = message.loading('正在创建采购单中，请勿关闭', 0);
    try {
      await StockinStore.dispatch('create', data);
      message.success('成功');
      hashHistory.push('/repertory/stockin');
    } catch (e) {
      setCreateLoading(false);
      message.error(e.message);
    } finally {
      warn();
    }
    console.log();
  };
  return (
    <>
      <div className={styles.tabHead}>
        <p>
          耗材进销存管理系统 / <a href="#/repertory/stockin">入库管理</a>
        </p>
        <h2>创建入库单</h2>
      </div>
      <div className={styles.tab}>
        <div className={styles.contentCard}>
          <h3 className={styles.titleCard}>
            选择入库仓库：
            <RepertorySelect repertory={repertory} setRepertory={setRepertory} active />
          </h3>
          {repertory.id ? <RepertoryShow repertory={repertory} /> : null}
        </div>
        <Divider className={styles.cardDivider} />
        <div className={styles.contentCard}>
          <h3 className={styles.titleCard}>采购单</h3>
          <div>
            采购单：
            <PurchaseSelect
              purchase={purchase}
              setPurchase={r => setPurchase(r)}
              active
              filter={r => purchases.findIndex(item => item.id === r.id) < 0}
            />
            <Divider type="vertical" />
            <Button
              onClick={() => {
                if (!purchase.id) {
                  return null;
                }
                setPurchase({} as Purchase);
                setPurchases(purchases.concat([purchase]));
              }}
            >
              添加采购单
            </Button>
          </div>
          <Table<Purchase> dataSource={purchases} columns={purchasesCol} rowKey={r => `${r.id}`} pagination={false} />
        </div>
        <Divider className={styles.cardDivider} />
        <div className={styles.contentCard}>
          <h3 className={styles.titleCard}>退货单</h3>
          <div>
            退货单：
            <ResaleSelect
              resale={resale}
              setResale={r => setResale(r)}
              active
              filter={r => resales.findIndex(item => item.id === r.id) < 0}
            />
            <Divider type="vertical" />
            <Button
              onClick={() => {
                if (!resale.id) {
                  return null;
                }
                setResale({} as Resale);
                setResales(resales.concat([resale]));
              }}
            >
              添加退货单
            </Button>
          </div>
          <Table<Resale> dataSource={resales} columns={resalesCol} rowKey={r => `${r.id}`} pagination={false} />
        </div>
        <Tables setResales={setResales} setPurchases={setPurchases} record={{ purchases, resales } as Stockin} />
        <Divider className={styles.cardDivider} />
        <div className={styles.contentCard}>
          <h3 className={styles.titleCard}>备注</h3>
          <TextArea value={remark} onChange={e => setRemark(e.target.value)} rows={4} />
        </div>
        <div className={styles.confirmBox}>
          <Button type="primary" loading={createLoading} onClick={onCreate}>
            提交
          </Button>
          <Button type="default" onClick={() => hashHistory.push('/repertory/stockin')}>
            返回
          </Button>
        </div>
      </div>
    </>
  );
};
