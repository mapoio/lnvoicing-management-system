import React, { useEffect, useState } from 'react';
import { Table, Button, message, Tooltip, Input, Row, Col, Badge } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { ResaleStore } from '@store/resale';
import { Resale, resaleStatus } from '@services/gql/resale';
import * as styles from '@shared/style/index.scss';
import { formatTime } from '@utils/index';
import { hashHistory } from '@store/router';

const { useStore, dispatch } = ResaleStore;

interface IOptionColProps {
  record: Resale;
}

const OptionCol = (props: IOptionColProps) => {
  const record = props.record;
  const [activeLoading, setActiveLoading] = useState(false);
  const onView = () => {
    hashHistory.push(`/resale?batch=${record.id}`);
  };
  const onChangeActive = async () => {
    const resaleitems = record.resaleitems.map(item => item.id);
    const newData: any = { ...record };
    newData.resaleitems = resaleitems;
    newData.customer = record.customer.id;
    newData.status = resaleStatus.INVAILD;
    setActiveLoading(true);
    try {
      await dispatch('update', newData);
      message.success('停用退货单成功');
    } catch (e) {
      message.error('停用退货单失败！');
    } finally {
      setActiveLoading(false);
    }
  };
  return (
    <>
      {record.status === resaleStatus.BUILDED || record.status === resaleStatus.CONFIRM ? (
        <Tooltip title={'停用本退货单'}>
          <Button icon={'stop'} type="default" shape="circle" loading={activeLoading} onClick={onChangeActive} />
        </Tooltip>
      ) : null}
      <Tooltip title="查看详情">
        <Button icon="eye" type="default" shape="circle" onClick={onView} />
      </Tooltip>
    </>
  );
};

const columns: Array<ColumnProps<Resale>> = [
  {
    title: '唯一ID',
    dataIndex: 'id'
  },
  {
    title: '单号',
    dataIndex: 'batch'
  },
  {
    title: '金额',
    dataIndex: 'money'
  },
  {
    title: '客户名称',
    dataIndex: 'customer.name'
  },
  {
    title: '客户电话',
    dataIndex: 'customer.phone'
  },
  {
    title: '备注',
    dataIndex: 'remark'
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
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (status: resaleStatus) => {
      const statusText =
        {
          [resaleStatus.BUILDED]: {
            color: '#108ee9',
            text: '已建立'
          },
          [resaleStatus.CONFIRM]: {
            color: '#108ee9',
            text: '已确认'
          },
          [resaleStatus.STOCKIN]: {
            color: 'green',
            text: '已入库'
          },
          [resaleStatus.INVAILD]: {
            color: '#f50',
            text: '无效'
          }
        }[status] || {};
      const color = statusText.color;
      return <Badge color={color} status="processing" text={statusText.text} />;
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
    hashHistory.push(`/resale?batch`);
  };
  const getData = async (num: number = 5) => {
    setLoding(true);
    try {
      await dispatch('getList', num);
      message.success('获取退货单数据成功');
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
      <Table<Resale>
        columns={columns}
        dataSource={list.filter(item => item.batch.includes(search))}
        rowKey={r => `${r.id}`}
        loading={loading}
        pagination={{ showSizeChanger: true }}
      />
    </div>
  );
};
