import React, { useEffect, useState } from 'react';
import { Table, Button, message, Tooltip, Input, Row, Col, Badge } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { SaleStore } from '@store/sale';
import { Sale, saleStatus } from '@services/gql/sale';
import * as styles from '@shared/style/index.scss';
import { formatTime } from '@utils/index';
import { hashHistory } from '@store/router';

const { useStore, dispatch } = SaleStore;

interface IOptionColProps {
  record: Sale;
}

const OptionCol = (props: IOptionColProps) => {
  const record = props.record;
  const [activeLoading, setActiveLoading] = useState(false);
  const onView = () => {
    hashHistory.push(`/sale?batch=${record.id}`);
  };
  const onChangeActive = async () => {
    const saleitems = record.saleitems.map(item => item.id);
    const newData: any = { ...record };
    newData.saleitems = saleitems;
    newData.customer = record.customer.id;
    newData.status = saleStatus.INVAILD;
    setActiveLoading(true);
    try {
      await dispatch('update', newData);
      message.success('停用销售单成功');
    } catch (e) {
      message.error('停用销售单失败！');
    } finally {
      setActiveLoading(false);
    }
  };
  return (
    <>
      {record.status === saleStatus.BUILDED || record.status === saleStatus.CONFIRM ? (
        <Tooltip title={'停用本销售单'}>
          <Button icon={'stop'} type="default" shape="circle" loading={activeLoading} onClick={onChangeActive} />
        </Tooltip>
      ) : null}
      <Tooltip title="查看详情">
        <Button icon="eye" type="default" shape="circle" onClick={onView} />
      </Tooltip>
    </>
  );
};

export const columns: Array<ColumnProps<Sale>> = [
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
    render: (status: saleStatus) => {
      const statusText =
        {
          [saleStatus.BUILDED]: {
            color: '#108ee9',
            text: '已建立'
          },
          [saleStatus.CONFIRM]: {
            color: '#108ee9',
            text: '已确认'
          },
          [saleStatus.STOCKOUT]: {
            color: 'green',
            text: '已出库'
          },
          [saleStatus.INVAILD]: {
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
    hashHistory.push(`/sale?batch`);
  };
  const getData = async (num: number = 5) => {
    setLoding(true);
    try {
      await dispatch('getList', num);
      message.success('获取销售单数据成功');
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
      <Table<Sale>
        columns={columns}
        dataSource={list.filter(item => item.batch.includes(search))}
        rowKey={r => `${r.id}`}
        loading={loading}
        pagination={{ showSizeChanger: true }}
      />
    </div>
  );
};
