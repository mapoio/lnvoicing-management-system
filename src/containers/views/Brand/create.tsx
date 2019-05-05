import React from 'react';
import { Button, Input, Modal, Form } from 'antd';
import { BrandStore } from '@store/brand';
import { formItemLayout } from '@constants/index';
import { useCreateOrUpdateState } from '@components/UseStates';
import { BrandCoreData } from '@services/gql/brand';

const { dispatch } = BrandStore;

interface ICreateBrand {
  show: boolean;
  onShow: (show: boolean) => void;
}

export const CreateModal = (props: ICreateBrand) => {
  const initData: BrandCoreData = {
    name: '',
    remark: '',
    manufacturer: ''
  };
  const { data, setData, loading, setLoading } = useCreateOrUpdateState(initData);
  const onCancel = () => {
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
