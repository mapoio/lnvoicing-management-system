import React, { useEffect, useState } from 'react';
import { Table, Button, message, Tooltip, Input, Row, Col, Badge } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { PurchaseStore } from '@store/purchase';
import { Purchase, purchaseStatus } from '@services/gql/purchase';
import { CreateModal } from './create';
import { UpdateModal } from './update';
import dayjs from 'dayjs';
import * as styles from '@shared/style/index.scss';

const { useStore, dispatch } = PurchaseStore;

type adtdType = 'success' | 'processing' | 'default' | 'error' | 'warning';

interface IOptionColProps {
  record: Purchase;
}

const OptionCol = (props: IOptionColProps) => {
  const record = props.record;
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeLoading, setActiveLoading] = useState(false);
  const [updateShow, setUpdateShow] = useState(false);
  const onDelete = async () => {
    setDeleteLoading(true);
    try {
      await dispatch('deleteSingle', record.id);
      message.success('成功删除本采购单！');
    } catch (e) {
      setDeleteLoading(false);
      message.error('删除采购单失败！');
    }
  };
  const onUpdate = async () => setUpdateShow(true);
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
      <Tooltip title={activeShow.title}>
        <Button icon={activeShow.icon} type="default" shape="circle" loading={activeLoading} onClick={onChangeActive} />
      </Tooltip>
      <Tooltip title="修改本条数据">
        <Button icon="edit" type="default" shape="circle" onClick={onUpdate} />
      </Tooltip>
      <Tooltip title="删除本条数据">
        <Button icon="delete" type="danger" shape="circle" loading={deleteLoading} onClick={onDelete} />
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
    render: (num: number) => dayjs(num).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '创建时间',
    dataIndex: 'updated_at',
    render: (num: number) => dayjs(num).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (status: purchaseStatus) => {
      const statusText =
        {
          [purchaseStatus.BUILDED]: {
            icon: 'success',
            text: '已建立'
          },
          [purchaseStatus.INVAILD]: {
            icon: 'error',
            text: '无效'
          }
        }[status] || {};
      const color = statusText.icon as adtdType;
      return <Badge status={color} text={statusText.text} />;
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
      <CreateModal show={showCreate} onShow={setShowCreate} />
      <Row gutter={12}>
        <Col span={8}>
          <Input placeholder="输入名称搜索" value={search} onChange={onChangeSearch} />
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
