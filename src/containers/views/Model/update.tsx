import React from 'react';
import { Button, Input, Modal, Form } from 'antd';
import { ModelStore } from '@store/model';
import { formItemLayout } from '@constants/index';
import { Model } from '@services/gql/model';
import { useCreateOrUpdateState } from '@components/UseStates';

const { dispatch } = ModelStore;

interface IUpdateModel {
  show: boolean;
  onShow: (show: boolean) => void;
  data: Model;
}

export const UpdateModal = (props: IUpdateModel) => {
  const { data, setData, loading, setLoading } = useCreateOrUpdateState(props.data);
  const onCancel = () => {
    setData(props.data);
    props.onShow(false);
  };
  const onOK = async () => {
    setLoading(true);
    await dispatch('update', data);
    setData(props.data);
    props.onShow(false);
    setLoading(false);
  };
  const FooterButton = () => {
    return (
      <div>
        <Button type="dashed" onClick={onCancel}>
          取消
        </Button>
        <Button type="primary" onClick={onOK} loading={loading}>
          修改
        </Button>
      </div>
    );
  };
  const FormItem = Form.Item;
  return (
    <Modal title="修改商品类型" visible={props.show} footer={<FooterButton />} onCancel={onCancel}>
      <Form {...formItemLayout}>
        <FormItem label="唯一ID" required>
          <span>{data.id}</span>
        </FormItem>
        <FormItem label="商品类型名称" required>
          <Input
            placeholder="输入商品类型名称"
            value={data.name}
            onChange={e => setData(Object.assign({}, data, { name: e.target.value }))}
          />
        </FormItem>
        <FormItem label="商品类型备注" required>
          <Input
            placeholder="输入商品类型备注"
            value={data.remark}
            onChange={e => setData(Object.assign({}, data, { remark: e.target.value }))}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};
