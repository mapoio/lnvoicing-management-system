import React, { useEffect, useState } from 'react';
import * as styles from '@shared/style/index.scss';
import { StockoutStore } from '@store/stockout';
import { Row, Col, Divider, Table, Tag, Button, Tooltip, message } from 'antd';
import { Stockout } from '@services/gql/stockout';
import { formatTime } from '@utils/index';
import { columns as SaleCol } from '@views/Sale/table';
import { Repertory } from '@services/gql/repertory';
import { Sale } from '@services/gql/sale';
import { ColumnProps } from 'antd/lib/table';
import { Stock } from '@services/gql/stock';
import { RepertorySelect } from '@views/Repertory/service';
import { SaleSelect } from '@views/Sale/service';
import { Good } from '@services/gql/good';
import { cloneDeep } from 'lodash';
import { DynamicSelectTag } from '@shared/util';
import TextArea from 'antd/lib/input/TextArea';
import { hashHistory } from '@store/router';
import { GoodStore } from '@store/good';

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

const saleTmpCol = [...SaleCol];
saleTmpCol.pop();
saleTmpCol.splice(2, 1);
const salesColumns = saleTmpCol;

type goodsCol = {
  id: string;
  good: Good;
  amount: number;
  stocks: Stock[] | string[];
  type?: string;
  setTag?: (tags: Stock[]) => void;
};

interface IGoodSelect {
  stocks: Stock[];
  setStocks: (stocks: Stock[]) => void;
  max: number;
  goodID: string;
}

const GoodSelect = (props: IGoodSelect) => {
  const { stocks, setStocks, max, goodID } = props;
  const list = GoodStore.useStore(s => s.list);
  useEffect(() => {
    if (list.length === 0) {
      GoodStore.dispatch('getList', 500);
    }
  }, []);
  const goods = list.filter(s => s.id === goodID)[0];
  if (!goods) {
    return null;
  }
  return <DynamicSelectTag source={goods.stocks} stocks={stocks} setStocks={setStocks} max={max} />;
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
    render: (stocks: Stock[], record) => {
      return <GoodSelect goodID={record.good.id} stocks={stocks} setStocks={record.setTag} max={record.amount} />;
    }
  }
];

interface IGoodsShow {
  record: Partial<Stockout>;
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
}
export const Tables = (props: IGoodsShow) => {
  const goodsList = props.record.sales
    .map((item, salesIndex) =>
      item.saleitems.map((s, saleitemsIndex) => ({
        ...s,
        type: '销售单',
        setTag: (tags: Stock[]) => {
          const data = cloneDeep(props.record.sales);
          data[salesIndex].saleitems[saleitemsIndex].stocks = tags;
          props.setSales(data);
        }
      }))
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
  const [sale, setSale] = useState({} as Sale);
  const [sales, setSales] = useState([] as Sale[]);
  const [remark, setRemark] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const removeSale = (index: number) => {
    const items = [...sales];
    items.splice(index - 1, 1);
    setSales(items);
  };
  const salesCol = salesColumns.concat([
    {
      key: 'customer.id',
      title: '操作',
      render: (_, _a, index) => {
        return (
          <Tooltip title="删除本条数据">
            <Button icon="delete" type="danger" shape="circle" onClick={() => removeSale(index)} />
          </Tooltip>
        );
      }
    }
  ]);
  const onCreate = async () => {
    if (!repertory.id) {
      message.error('请选择出库仓库');
      return null;
    } else if (sales.length < 1) {
      message.error('请选择销售单');
      return null;
    }
    try {
      sales.map(item => {
        item.saleitems.map(i => {
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
      sales,
      remark
    };
    setCreateLoading(true);
    const warn = message.loading('正在创建采购单中，请勿关闭', 0);
    try {
      await StockoutStore.dispatch('create', data);
      message.success('成功');
      hashHistory.push('/repertory/stockout');
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
          耗材进销存管理系统 / <a href="#/repertory/stockout">出库管理</a>
        </p>
        <h2>创建出库单</h2>
      </div>
      <div className={styles.tab}>
        <div className={styles.contentCard}>
          <h3 className={styles.titleCard}>
            选择出库仓库：
            <RepertorySelect repertory={repertory} setRepertory={setRepertory} active />
          </h3>
          {repertory.id ? <RepertoryShow repertory={repertory} /> : null}
        </div>
        <Divider className={styles.cardDivider} />
        <div className={styles.contentCard}>
          <h3 className={styles.titleCard}>销售单</h3>
          <div>
            销售单：
            <SaleSelect
              sale={sale}
              setSale={r => setSale(r)}
              active
              filter={r => sales.findIndex(item => item.id === r.id) < 0}
            />
            <Divider type="vertical" />
            <Button
              onClick={() => {
                if (!sale.id) {
                  return null;
                }
                setSale({} as Sale);
                setSales(sales.concat([sale]));
              }}
            >
              添加销售单
            </Button>
          </div>
          <Table<Sale> dataSource={sales} columns={salesCol} rowKey={r => `${r.id}`} pagination={false} />
        </div>
        <Tables setSales={setSales} record={{ sales } as Stockout} />
        <Divider className={styles.cardDivider} />
        <div className={styles.contentCard}>
          <h3 className={styles.titleCard}>备注</h3>
          <TextArea value={remark} onChange={e => setRemark(e.target.value)} rows={4} />
        </div>
        <div className={styles.confirmBox}>
          <Button type="primary" loading={createLoading} onClick={onCreate}>
            提交
          </Button>
          <Button type="default" onClick={() => hashHistory.push('/repertory/stockout')}>
            返回
          </Button>
        </div>
      </div>
    </>
  );
};
