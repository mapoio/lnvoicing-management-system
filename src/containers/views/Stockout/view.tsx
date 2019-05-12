import React, { useEffect } from 'react';
import * as styles from '@shared/style/index.scss';
import { StockoutStore } from '@store/stockout';
import { Row, Col, Divider, Table, Tag } from 'antd';
import { Stockout, stockoutStatus } from '@services/gql/stockout';
import { formatTime, searchItem } from '@utils/index';
import { columns as SaleCol } from '@views/Sale/table';
import { Repertory } from '@services/gql/repertory';
import { Sale } from '@services/gql/sale';
import { ColumnProps } from 'antd/lib/table';
import { Saleitem } from '@services/gql/saleitem';
import { Stock } from '@services/gql/stock';

const statusOption = {
  [stockoutStatus.ACTIVE]: '有效',
  [stockoutStatus.INACTIVE]: '无效'
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

interface IStockoutShow {
  stockout: Stockout;
}

const UpdateStockoutShow = (props: IStockoutShow) => {
  const stockout = props.stockout;
  return (
    <Row gutter={16}>
      <Col span={16}>
        <Row>
          <Col className={styles.headCardItem} span={12}>
            ID：{stockout.id}
          </Col>
          <Col className={styles.headCardItem} span={12}>
            备注：{stockout.remark}
          </Col>
          <Col className={styles.headCardItem} span={12}>
            更新时间：{formatTime(stockout.updated_at)}
          </Col>
          <Col className={styles.headCardItem} span={12}>
            创建时间：{formatTime(stockout.created_at)}
          </Col>
        </Row>
      </Col>
      <Col className={`${styles.headCardItem} ${styles.end}`} span={6} offset={2}>
        <div className={styles.rightCard}>
          <p>状态</p>
          <h2>{statusOption[stockout.status]}</h2>
        </div>
      </Col>
    </Row>
  );
};

const saleTmpCol = [...SaleCol];
saleTmpCol.pop();
saleTmpCol.splice(2, 1);
const salesColumns = saleTmpCol;

interface ISaleShow {
  sales: Sale[];
}
export const SaleTables = (props: ISaleShow) => {
  const list = props.sales;
  return (
    <div className={styles.contentCard}>
      <h3 className={styles.titleCard}>退货单</h3>
      <Table<Sale> dataSource={list} columns={salesColumns} rowKey={r => `${r.id}`} pagination={false} />
    </div>
  );
};

const goodsColumns: Array<ColumnProps<Saleitem>> = [
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
  record: Stockout;
}
export const Tables = (props: IGoodsShow) => {
  const list = props.record.sales.map(item => item.saleitems).reduce((p, s) => p.concat(s), []);
  return (
    <div className={styles.contentCard}>
      <h3 className={styles.titleCard}>商品项</h3>
      <Table<Saleitem> dataSource={list} columns={goodsColumns} rowKey={r => `${r.id}`} pagination={false} />
    </div>
  );
};

interface IView {
  batchId: string;
}

export const View = (props: IView) => {
  const stockouts = StockoutStore.useStore(s => s).list;
  useEffect(() => {
    if (stockouts.length < 1) {
      StockoutStore.dispatch('getList', 500);
    }
    return () => false;
  }, []);
  const stockout = searchItem(props.batchId, stockouts).data;
  if (!stockout) {
    return <h2>不存在此单号出库单</h2>;
  }
  return (
    <>
      <div className={styles.tabHead}>
        <p>
          耗材进销存管理系统 / <a href="#/repertory/stockout">出库管理</a>
        </p>
        <h2>{stockout.batch}</h2>
        <UpdateStockoutShow stockout={stockout} />
      </div>
      <div className={styles.tab}>
        <RepertoryShow repertory={stockout.repertory} />
        <Divider className={styles.cardDivider} />
        <SaleTables sales={stockout.sales} />
        <Divider className={styles.cardDivider} />
        <Tables record={stockout} />
      </div>
    </>
  );
};
