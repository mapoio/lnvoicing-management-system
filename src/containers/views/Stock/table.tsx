import React, { useEffect, useState } from 'react';
import { Table, Button, message, Input, Row, Col, Badge } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { GoodStore } from '@store/good';
import { Good, goodStatus } from '@services/gql/good';
import * as styles from '@shared/style/index.scss';
import { Stock, stockStatus } from '@services/gql/stock';

const { useStore, dispatch } = GoodStore;

type adtdType = 'success' | 'processing' | 'default' | 'error' | 'warning';

const columns: Array<ColumnProps<Good>> = [
  {
    title: '唯一ID',
    dataIndex: 'id'
  },
  {
    title: '品牌',
    dataIndex: 'brand.name'
  },
  {
    title: '类型',
    dataIndex: 'model.name'
  },
  {
    title: '花纹',
    dataIndex: 'pattern'
  },
  {
    title: '载重指数',
    dataIndex: 'loadIndex'
  },
  {
    title: '规格',
    dataIndex: 'specification'
  },
  {
    title: '单位',
    dataIndex: 'unit'
  },
  {
    title: '速度级别',
    dataIndex: 'speedLevel'
  },
  {
    title: '制造厂商',
    dataIndex: 'brand.manufacturer'
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (status: goodStatus) => {
      const statusColor = {
        [goodStatus.ACTIVE]: 'success',
        [goodStatus.INACTIVE]: 'error'
      };
      const statusText = {
        [goodStatus.ACTIVE]: '激活',
        [goodStatus.INACTIVE]: '暂停'
      };
      const color = statusColor[status] as adtdType;
      return <Badge status={color} text={statusText[status]} />;
    }
  },
  {
    title: '库存数量',
    dataIndex: 'stocks',
    render: (stocks: Stock[]) => stocks.filter(s => s.status === stockStatus.STOCKIN).length
  }
];

export const Tables = () => {
  const list = useStore(s => s.list);
  const [loading, setLoding] = useState(false);
  const [search, setSearch] = useState('');
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const getData = async (num: number = 5) => {
    setLoding(true);
    try {
      await dispatch('getList', num);
      message.success('获取商品数据成功');
    } catch (error) {
      message.error(error.message);
    }
    setLoding(false);
  };
  useEffect(() => {
    if (list.length < 1) {
      getData(500);
    }
    return () => false;
  }, []);
  return (
    <div className={styles.contain}>
      <Row gutter={12}>
        <Col span={8}>
          <Input placeholder="输入规格或花纹搜索" value={search} onChange={onChangeSearch} />
        </Col>
        <Button icon="sync" type="default" loading={loading} onClick={() => getData(500)}>
          刷新
        </Button>
      </Row>
      <Table<Good>
        columns={columns}
        dataSource={list.filter(item => item.specification.includes(search) || item.pattern.includes(search))}
        rowKey={r => `${r.id}`}
        loading={loading}
        pagination={{ showSizeChanger: true }}
      />
    </div>
  );
};
