import React from 'react';
import { Button, Input, Modal, Form } from 'antd';
import { ModelStore } from '@store/model';
import { formItemLayout } from '@constants/index';
import { useCreateOrUpdateState } from '@components/UseStates';

const { dispatch } = ModelStore;

interface ICreateModel {
  show: boolean;
  onShow: (show: boolean) => void;
}

export const CreateModal = (props: ICreateModel) => {
  const initData = {
    name: '',
    remark: ''
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
          创建类型
        </Button>
      </div>
    );
  };
  const FormItem = Form.Item;
  return (
    <Modal title="创建商品类型" visible={props.show} footer={<FooterButton />} onCancel={onCancel}>
      <Form {...formItemLayout}>
        <FormItem label="商品类型名称" required>
          <Input
            placeholder="输入商品类型名称"
            value={data.name}
            onChange={e => setData({ name: e.target.value, remark: data.remark })}
          />
        </FormItem>
        <FormItem label="商品类型备注" required>
          <Input
            placeholder="输入商品类型备注"
            value={data.remark}
            onChange={e => setData({ remark: e.target.value, name: data.name })}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};
