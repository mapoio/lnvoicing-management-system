import React, { useEffect, useState } from 'react';
import { Table, Button, message, Tooltip, Input, Row, Col, Tag, Badge } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { SupplierStore } from '@store/supplier';
import { Supplier, supplierType, supplierStatus } from '@services/gql/supplier';
import { CreateModal } from './create';
import { UpdateModal } from './update';
import * as styles from '@shared/style/index.scss';

const { useStore, dispatch } = SupplierStore;

type adtdType = 'success' | 'processing' | 'default' | 'error' | 'warning';

interface IOptionColProps {
  record: Supplier;
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
      message.success('成功删除本供应商！');
    } catch (e) {
      setDeleteLoading(false);
      message.error('删除供应商失败！');
    }
  };
  const onUpdate = async () => setUpdateShow(true);
  const activeShow = {
    [supplierStatus.ACTIVE]: {
      title: '停用本条数据',
      icon: 'stop'
    },
    [supplierStatus.INACTIVE]: {
      title: '启用本条数据',
      icon: 'check'
    }
  }[record.status];
  const onChangeActive = async () => {
    const newData = { ...record };
    newData.status = record.status === supplierStatus.ACTIVE ? supplierStatus.INACTIVE : supplierStatus.ACTIVE;
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

const columns: Array<ColumnProps<Supplier>> = [
  {
    title: '唯一ID',
    dataIndex: 'id'
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '电话',
    dataIndex: 'phone'
  },
  {
    title: '地址',
    dataIndex: 'address'
  },
  {
    title: '负责人姓名',
    dataIndex: 'manageName'
  },
  {
    title: '负责人电话',
    dataIndex: 'managePhone'
  },
  {
    title: '供应商类型',
    dataIndex: 'type',
    render: (type: supplierType) => {
      const supplierTypeBox = {
        [supplierType.HIGH]: {
          text: '高级',
          color: '#f50'
        },
        [supplierType.MIDDLE]: {
          text: '中等',
          color: '#108ee9'
        },
        [supplierType.LOW]: {
          text: '初等',
          color: '#87d068'
        }
      }[type];
      if (!supplierTypeBox) {
        return <Tag color="red">未知类型</Tag>;
      }
      return <Tag color={supplierTypeBox.color}>{supplierTypeBox.text}</Tag>;
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (status: supplierStatus) => {
      const statusColor = {
        [supplierStatus.ACTIVE]: 'success',
        [supplierStatus.INACTIVE]: 'error'
      };
      const statusText = {
        [supplierStatus.ACTIVE]: '激活',
        [supplierStatus.INACTIVE]: '暂停'
      };
      const color = statusColor[status] as adtdType;
      return <Badge status={color} text={statusText[status]} />;
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
      message.success('获取供应商数据成功');
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
      <Table<Supplier>
        columns={columns}
        dataSource={list.filter(item => item.name.includes(search))}
        rowKey={r => `${r.id}`}
        loading={loading}
        pagination={{ showSizeChanger: true }}
      />
    </div>
  );
};
