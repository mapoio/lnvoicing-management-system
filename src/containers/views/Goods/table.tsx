import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, message, Divider, Tooltip, Input, Row, Col } from 'antd';
import { cloneDeep } from 'lodash';
import { ColumnProps } from 'antd/lib/table';
import { GoodsStore } from '@store/goods';
import { IGoodsWithInfo, GoodsStatus } from '@services/gql/goods';
import * as styles from './table.scss';

const { useStore, dispatch } = GoodsStore;

type adtdType = 'success' | 'processing' | 'default' | 'error' | 'warning';

interface IOptionColProps {
  record: IGoodsWithInfo;
}

const OptionCol = (props: IOptionColProps) => {
  const record = props.record;
  const [activeLoading, setActiveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const optionShow = {
    [GoodsStatus.ACTIVE]: {
      title: '停用本条商品',
      icon: 'stop'
    },
    [GoodsStatus.INACTIVE]: {
      title: '启用本条商品',
      icon: 'check'
    }
  }[record.status];
  const onChangeActive = async () => {
    const data = cloneDeep(record);
    data.status = data.status === GoodsStatus.ACTIVE ? GoodsStatus.INACTIVE : GoodsStatus.ACTIVE;
    setActiveLoading(true);
    try {
      await dispatch('setActiveStatus', data);
      message.success('成功' + optionShow.title);
    } catch (e) {
      message.error(optionShow.title + '失败！');
    }
    setActiveLoading(false);
  };
  const onDeleteGoods = async () => {
    setDeleteLoading(true);
    try {
      await dispatch('deleteSingleGoods', record.id);
      message.success('成功删除本商品！');
    } catch (e) {
      setDeleteLoading(false);
      message.error('删除商品失败！');
    }
  };
  return (
    <>
      <Tooltip title={optionShow.title}>
        <Button icon={optionShow.icon} type="default" shape="circle" loading={activeLoading} onClick={onChangeActive} />
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip title="删除本条商品">
        <Button icon="delete" type="danger" shape="circle" loading={deleteLoading} onClick={onDeleteGoods} />
      </Tooltip>
    </>
  );
};

const columns: Array<ColumnProps<IGoodsWithInfo>> = [
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
    // key: 'status',
    render: (text: GoodsStatus) => {
      const statusColor = {
        [GoodsStatus.ACTIVE]: 'success',
        [GoodsStatus.INACTIVE]: 'error'
      };
      const statusText = {
        [GoodsStatus.ACTIVE]: '激活',
        [GoodsStatus.INACTIVE]: '暂停'
      };
      const color = statusColor[text] as adtdType;
      return <Badge status={color} text={statusText[text]} />;
    }
  },
  {
    title: '操作',
    key: 'id',
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
  const getGoodsData = async (num: number = 5) => {
    setLoding(true);
    try {
      await dispatch('getGoodsData', num);
      message.success('获取商品数据成功');
    } catch (error) {
      message.error(error.message);
    }
    setLoding(false);
  };
  useEffect(() => {
    if (list.length < 1) {
      getGoodsData(500);
    }
    return () => false;
  }, []);
  return (
    <div className={styles.contain}>
      <Row gutter={12}>
        <Col span={8}>
          <Input placeholder="输入规格或花纹搜索" value={search} onChange={onChangeSearch} />
        </Col>
        <Button icon="plus" type="primary">
          新建
        </Button>
      </Row>
      <Table<IGoodsWithInfo>
        columns={columns}
        dataSource={list.filter(item => item.specification.includes(search) || item.pattern.includes(search))}
        rowKey={r => r.id}
        loading={loading}
        pagination={{ showSizeChanger: true }}
      />
    </div>
  );
};
