import React from 'react';
import { Button, Modal, Form, message } from 'antd';
import { SupplierStore } from '@store/supplier';
import { formItemLayout } from '@constants/index';
import { Supplier } from '@services/gql/supplier';
import { useCreateOrUpdateState } from '@components/UseStates';
import { CreateOrUpdateForm } from './form';

const FormItem = Form.Item;
const { dispatch } = SupplierStore;

interface IUpdateSupplier {
  show: boolean;
  onShow: (show: boolean) => void;
  data: Supplier;
}

export const UpdateModal = (props: IUpdateSupplier) => {
  const { data, setData, loading, setLoading } = useCreateOrUpdateState(props.data);
  const onCancel = () => {
    setData(props.data);
    props.onShow(false);
  };
  const onOK = async () => {
    setLoading(true);
    await dispatch('update', data);
    message.success('修改供应商成功');
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
    <Modal title="修改供应商" visible={props.show} footer={<FooterButton />} onCancel={onCancel}>
      <Form {...formItemLayout}>
        <FormItem label="唯一ID" required>
          <span>{data.id}</span>
        </FormItem>
        <CreateOrUpdateForm data={data} setData={setData} />
      </Form>
    </Modal>
  );
};
