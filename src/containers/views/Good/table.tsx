import React, { useEffect, useState } from 'react';
import { Table, Button, message, Tooltip, Input, Row, Col, Badge } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { GoodStore } from '@store/good';
import { Good, goodStatus } from '@services/gql/good';
import { CreateModal } from './create';
import { UpdateModal } from './update';
import * as styles from '@shared/style/index.scss';

const { useStore, dispatch } = GoodStore;

type adtdType = 'success' | 'processing' | 'default' | 'error' | 'warning';

interface IOptionColProps {
  record: Good;
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
      message.success('成功删除本商品！');
    } catch (e) {
      setDeleteLoading(false);
      message.error('删除商品失败！');
    }
  };
  const onUpdate = async () => setUpdateShow(true);
  const activeShow =
    {
      [goodStatus.ACTIVE]: {
        title: '停用本条数据',
        icon: 'stop'
      },
      [goodStatus.INACTIVE]: {
        title: '启用本条数据',
        icon: 'check'
      }
    }[record.status] || {};
  const onChangeActive = async () => {
    const newData = { ...record };
    newData.status = record.status === goodStatus.ACTIVE ? goodStatus.INACTIVE : goodStatus.ACTIVE;
    setActiveLoading(true);
    try {
      await dispatch('update', Object.assign({}, newData, { model: newData.model.id, brand: newData.brand.id }));
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
      <CreateModal show={showCreate} onShow={setShowCreate} />
      <Row gutter={12}>
        <Col span={8}>
          <Input placeholder="输入规格或花纹搜索" value={search} onChange={onChangeSearch} />
        </Col>
        <Button icon="plus" type="primary" onClick={onShowCreate}>
          新建
        </Button>
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
