import React, { useEffect, useState } from 'react';
import { Table, Button, message, Tooltip, Input, Row, Col, Badge } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { StockinStore } from '@store/stockin';
import { Stockin, stockinStatus } from '@services/gql/stockin';
import * as styles from '@shared/style/index.scss';
import { formatTime } from '@utils/index';
import { hashHistory } from '@store/router';

const { useStore, dispatch } = StockinStore;

interface IOptionColProps {
  record: Stockin;
}

const OptionCol = (props: IOptionColProps) => {
  const record = props.record;
  const onView = () => {
    hashHistory.push(`/repertory/stockin?batch=${record.id}`);
  };
  return (
    <>
      <Tooltip title="查看详情">
        <Button icon="eye" type="default" shape="circle" onClick={onView} />
      </Tooltip>
    </>
  );
};

const columns: Array<ColumnProps<Stockin>> = [
  {
    title: '唯一ID',
    dataIndex: 'id'
  },
  {
    title: '单号',
    dataIndex: 'batch'
  },
  {
    title: '入库仓库',
    dataIndex: 'repertory.name'
  },
  {
    title: '仓库地址',
    dataIndex: 'repertory.address'
  },
  {
    title: '备注',
    dataIndex: 'remark'
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
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (status: stockinStatus) => {
      const statusText =
        {
          [stockinStatus.ACTIVE]: {
            color: 'green',
            text: '有效'
          },
          [stockinStatus.INACTIVE]: {
            color: '#f50',
            text: '无效'
          }
        }[status] || {};
      const color = statusText.color;
      return <Badge color={color} text={statusText.text} />;
    }
  },
  {
    title: '操作',
    render: (_, record) => {
      return <OptionCol record={record} />;
    }
  }
];

export const Tables = () => {
  const list = useStore(s => s.list);
  const [loading, setLoding] = useState(false);
  const [search, setSearch] = useState('');
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const onShowCreate = () => {
    hashHistory.push(`/repertory/stockin?batch`);
  };
  const getData = async (num: number = 5) => {
    setLoding(true);
    try {
      await dispatch('getList', num);
      message.success('获取入库单数据成功');
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoding(false);
    }
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
          <Input placeholder="输入批号搜索" value={search} onChange={onChangeSearch} />
        </Col>
        <Button icon="plus" type="primary" onClick={onShowCreate}>
          新建
        </Button>
        <Button icon="sync" type="default" loading={loading} onClick={() => getData(500)}>
          刷新
        </Button>
      </Row>
      <Table<Stockin>
        columns={columns}
        dataSource={list.filter(item => item.batch.includes(search))}
        rowKey={r => `${r.id}`}
        loading={loading}
        pagination={{ showSizeChanger: true }}
      />
    </div>
  );
};
