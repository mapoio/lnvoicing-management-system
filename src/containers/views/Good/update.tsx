import React from 'react';
import { Button, Modal, Form, message } from 'antd';
import { GoodStore } from '@store/good';
import { formItemLayout } from '@constants/index';
import { Good } from '@services/gql/good';
import { useCreateOrUpdateState } from '@components/UseStates';
import { CreateOrUpdateForm } from './form';

const FormItem = Form.Item;
const { dispatch } = GoodStore;

interface IUpdateGood {
  show: boolean;
  onShow: (show: boolean) => void;
  data: Good;
}

export const UpdateModal = (props: IUpdateGood) => {
  const { data, setData, loading, setLoading } = useCreateOrUpdateState(props.data);
  const onCancel = () => {
    setData(props.data);
    props.onShow(false);
  };
  const onOK = async () => {
    setLoading(true);
    await dispatch('update', Object.assign({}, data, { model: data.model.id, brand: data.brand.id }));
    message.success('修改商品成功');
    setData(data);
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
  return (
    <Modal title="修改商品" visible={props.show} footer={<FooterButton />} onCancel={onCancel}>
      <Form {...formItemLayout}>
        <FormItem label="唯一ID" required>
          <span>{data.id}</span>
        </FormItem>
        <CreateOrUpdateForm data={data} setData={setData} />
      </Form>
    </Modal>
  );
};
