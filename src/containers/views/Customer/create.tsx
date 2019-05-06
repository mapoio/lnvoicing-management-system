import React from 'react';
import { Button, Modal, Form } from 'antd';
import { CustomerStore } from '@store/customer';
import { useCreateOrUpdateState } from '@components/UseStates';
import { CustomerCoreData } from '@services/gql/customer';
import { CreateOrUpdateForm } from './form';
import { formItemLayout } from '@constants/index';

const { dispatch } = CustomerStore;

interface ICreateCustomer {
  show: boolean;
  onShow: (show: boolean) => void;
}

export const CreateModal = (props: ICreateCustomer) => {
  const initData: Partial<CustomerCoreData> = {
    name: '',
    phone: undefined,
    address: ''
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
  return (
    <Modal title="创建商品品牌" visible={props.show} footer={<FooterButton />} onCancel={onCancel}>
      <Form {...formItemLayout}>
        <CreateOrUpdateForm data={data} setData={setData} />
      </Form>
    </Modal>
  );
};
