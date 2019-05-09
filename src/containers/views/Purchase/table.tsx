import React, { useEffect, useState } from 'react';
import { Table, Button, message, Tooltip, Input, Row, Col, Badge } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { PurchaseStore } from '@store/purchase';
import { Purchase, purchaseStatus } from '@services/gql/purchase';
// import { CreateModal } from './create';
import { UpdateModal } from './update';
import * as styles from '@shared/style/index.scss';
import { formatTime } from '@utils/index';
import { hashHistory } from '@store/router';

const { useStore, dispatch } = PurchaseStore;

interface IOptionColProps {
  record: Purchase;
}

const OptionCol = (props: IOptionColProps) => {
  const record = props.record;
  const [activeLoading, setActiveLoading] = useState(false);
  const [updateShow, setUpdateShow] = useState(false);
  const onUpdate = () => {
    hashHistory.push(`/purchase?batch=${record.id}`);
  };
  const activeShow =
    {
      [purchaseStatus.BUILDED]: {
        title: '停用本条数据',
        icon: 'stop'
      },
      [purchaseStatus.INVAILD]: {
        title: '启用本条数据',
        icon: 'check'
      }
    }[record.status] || {};
  const onChangeActive = async () => {
    const newData = { ...record };
    newData.status = record.status === purchaseStatus.BUILDED ? purchaseStatus.INVAILD : purchaseStatus.BUILDED;
    setActiveLoading(true);
    try {
      await dispatch('update', newData);
      message.success('成功' + activeShow.title);
    } catch (e) {
      message.error(activeShow.title + '失败！');
    }
    setActiveLoading(false);
  };
  return (
    <>
      <UpdateModal show={updateShow} onShow={setUpdateShow} data={record} />
      {record.status === purchaseStatus.BUILDED || record.status === purchaseStatus.CONFIRM ? (
        <Tooltip title={activeShow.title}>
          <Button
            icon={activeShow.icon}
            type="default"
            shape="circle"
            loading={activeLoading}
            onClick={onChangeActive}
          />
        </Tooltip>
      ) : null}
      <Tooltip title="查看详情">
        <Button icon="eye" type="default" shape="circle" onClick={onUpdate} />
      </Tooltip>
    </>
  );
};

const columns: Array<ColumnProps<Purchase>> = [
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
    title: '供应商名称',
    dataIndex: 'supplier.name'
  },
  {
    title: '供应商电话',
    dataIndex: 'supplier.phone'
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
    render: (status: purchaseStatus) => {
      const statusText =
        {
          [purchaseStatus.BUILDED]: {
            color: '#108ee9',
            text: '已建立'
          },
          [purchaseStatus.CONFIRM]: {
            color: 'orange',
            text: '已确认'
          },
          [purchaseStatus.STOCKIN]: {
            color: 'green',
            text: '已入库'
          },
          [purchaseStatus.INVAILD]: {
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
  const [showCreate, setShowCreate] = useState(false);
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const onShowCreate = () => {
    setShowCreate(true);
  };
  const getData = async (num: number = 5) => {
    setLoding(true);
    try {
      await dispatch('getList', num);
      message.success('获取采购单数据成功');
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
      {/* <CreateModal show={showCreate} onShow={setShowCreate} /> */}
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
      <Table<Purchase>
        columns={columns}
        dataSource={list.filter(item => item.batch.includes(search))}
        rowKey={r => `${r.id}`}
        loading={loading}
        pagination={{ showSizeChanger: true }}
      />
    </div>
  );
};
