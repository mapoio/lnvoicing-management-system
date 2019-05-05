import React, { useEffect, useState } from 'react';
import { Table, Button, message, Tooltip, Input, Row, Col, Modal, Form } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { BrandStore } from '@store/brand';
import { Brand } from '@services/gql/goods';
import * as styles from './table.scss';

const { useStore, dispatch } = BrandStore;

interface IOptionColProps {
  record: Brand;
}

const OptionCol = (props: IOptionColProps) => {
  const record = props.record;
  const [deleteLoading, setDeleteLoading] = useState(false);
  const onDeleteGoods = async () => {
    setDeleteLoading(true);
    try {
      await dispatch('deleteSingle', record.id);
      message.success('成功删除本品牌！');
    } catch (e) {
      setDeleteLoading(false);
      message.error('删除品牌失败！');
    }
  };
  return (
    <>
      <Tooltip title="删除本条商品">
        <Button icon="delete" type="danger" shape="circle" loading={deleteLoading} onClick={onDeleteGoods} />
      </Tooltip>
    </>
  );
};

interface ICreateModel {
  show: boolean;
  onShow: (show: boolean) => void;
}

const CreateModel = (props: ICreateModel) => {
  const initData: Pick<Brand, 'manufacturer' | 'name' | 'remark'> = {
    name: '',
    remark: '',
    manufacturer: ''
  };
  const [data, setData] = useState(initData);
  const [loading, setLoading] = useState(false);
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 }
    }
  };
  const onCancel = (e: React.MouseEvent<any, MouseEvent>) => {
    setData(initData);
    props.onShow(false);
  };
  const onOK = async () => {
    setLoading(true);
    await dispatch('create', data);
    setData(initData);
    props.onShow(false);
    setLoading(false);
  };
  const FooterButton = () => {
    return (
      <div>
        <Button type="dashed" onClick={onCancel}>
          取消创建
        </Button>
        <Button type="primary" onClick={onOK} loading={loading}>
          创建品牌
        </Button>
      </div>
    );
  };
  const FormItem = Form.Item;
  return (
    <Modal title="创建商品品牌" visible={props.show} footer={<FooterButton />} onCancel={onCancel}>
      <Form {...formItemLayout}>
        <FormItem label="商品品牌名称" required>
          <Input
            placeholder="输入商品品牌名称"
            value={data.name}
            onChange={e => setData(Object.assign({}, data, { name: e.target.value }))}
          />
        </FormItem>
        <FormItem label="商品品牌制造商" required>
          <Input
            placeholder="输入商品品牌制造商"
            value={data.manufacturer}
            onChange={e => setData(Object.assign({}, data, { manufacturer: e.target.value }))}
          />
        </FormItem>
        <FormItem label="商品品牌备注" required>
          <Input
            placeholder="输入商品品牌备注"
            value={data.remark}
            onChange={e => setData(Object.assign({}, data, { remark: e.target.value }))}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};

const columns: Array<ColumnProps<Brand>> = [
  {
    title: '唯一ID',
    dataIndex: 'id',
    width: 400
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '制造商',
    dataIndex: 'manufacturer'
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
      message.success('获取商品品牌数据成功');
    } catch (error) {
      message.error(error.message);
    }
    setLoding(false);
  };
  useEffect(() => {
    if (list.length < 1) {
      getData(5);
    }
    return () => false;
  }, []);
  return (
    <div className={styles.contain}>
      <CreateModel show={showCreate} onShow={setShowCreate} />
      <Row gutter={12}>
        <Col span={8}>
          <Input placeholder="输入品牌名称搜索" value={search} onChange={onChangeSearch} />
        </Col>
        <Button icon="plus" type="primary" onClick={onShowCreate}>
          新建
        </Button>
      </Row>
      <Table<Brand>
        columns={columns}
        dataSource={list.filter(item => item.name.includes(search))}
        rowKey={r => r.id}
        loading={loading}
        pagination={{ showSizeChanger: true }}
      />
    </div>
  );
};
