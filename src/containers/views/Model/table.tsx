import React, { useEffect, useState } from 'react';
import { Table, Button, message, Tooltip, Input, Row, Col } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { ModelStore } from '@store/model';
import { Model } from '@services/gql/model';
import { CreateModal } from './create';
import { UpdateModal } from './update';
import * as styles from '@shared/style/index.scss';

const { useStore, dispatch } = ModelStore;

interface IOptionColProps {
  record: Model;
}

const OptionCol = (props: IOptionColProps) => {
  const record = props.record;
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateShow, setUpdateShow] = useState(false);
  const onDelete = async () => {
    setDeleteLoading(true);
    try {
      await dispatch('deleteSingle', record.id);
      message.success('成功删除本类型！');
    } catch (e) {
      setDeleteLoading(false);
      message.error('删除类型失败！');
    }
  };
  const onUpdate = async () => setUpdateShow(true);
  return (
    <>
      <UpdateModal show={updateShow} onShow={setUpdateShow} data={record} />
      <Tooltip title="修改本条商品">
        <Button icon="edit" type="default" shape="circle" onClick={onUpdate} />
      </Tooltip>
      <Tooltip title="删除本条商品">
        <Button icon="delete" type="danger" shape="circle" loading={deleteLoading} onClick={onDelete} />
      </Tooltip>
    </>
  );
};

const columns: Array<ColumnProps<Model>> = [
  {
    title: '唯一ID',
    dataIndex: 'id'
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '备注',
    dataIndex: 'remark'
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
      message.success('获取商品类型数据成功');
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
          <Input placeholder="输入类型名称搜索" value={search} onChange={onChangeSearch} />
        </Col>
        <Button icon="plus" type="primary" onClick={onShowCreate}>
          新建
        </Button>
        <Button icon="sync" type="default" loading={loading} onClick={() => getData(500)}>
          刷新
        </Button>
      </Row>
      <Table<Model>
        columns={columns}
        dataSource={list.filter(item => item.name.includes(search))}
        rowKey={r => `${r.id}`}
        loading={loading}
        pagination={{ showSizeChanger: true }}
      />
    </div>
  );
};
