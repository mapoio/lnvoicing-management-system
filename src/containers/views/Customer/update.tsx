import React from 'react';
import { Button, Modal, Form, message } from 'antd';
import { CustomerStore } from '@store/customer';
import { formItemLayout } from '@constants/index';
import { Customer } from '@services/gql/customer';
import { useCreateOrUpdateState } from '@components/UseStates';
import { CreateOrUpdateForm } from './form';

const FormItem = Form.Item;
const { dispatch } = CustomerStore;

interface IUpdateCustomer {
  show: boolean;
  onShow: (show: boolean) => void;
  data: Customer;
}

export const UpdateModal = (props: IUpdateCustomer) => {
  const { data, setData, loading, setLoading } = useCreateOrUpdateState(props.data);
  const onCancel = () => {
    setData(props.data);
    props.onShow(false);
  };
  const onOK = async () => {
    setLoading(true);
    await dispatch('update', data);
    message.success('修改客户成功');
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
    <Modal title="修改客户" visible={props.show} footer={<FooterButton />} onCancel={onCancel}>
      <Form {...formItemLayout}>
        <FormItem label="唯一ID" required>
          <span>{data.id}</span>
        </FormItem>
        <CreateOrUpdateForm data={data} setData={setData} />
      </Form>
    </Modal>
  );
};
