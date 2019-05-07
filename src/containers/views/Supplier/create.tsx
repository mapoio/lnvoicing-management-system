import React from 'react';
import { Button, Modal, Form } from 'antd';
import { SupplierStore } from '@store/supplier';
import { useCreateOrUpdateState } from '@components/UseStates';
import { SupplierCoreData } from '@services/gql/supplier';
import { CreateOrUpdateForm } from './form';
import { formItemLayout } from '@constants/index';

const { dispatch } = SupplierStore;

interface ICreateSupplier {
  show: boolean;
  onShow: (show: boolean) => void;
}

export const CreateModal = (props: ICreateSupplier) => {
  const initData: Partial<SupplierCoreData> = {
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
          创建供应商
        </Button>
      </div>
    );
  };
  return (
    <Modal title="创建供应商" visible={props.show} footer={<FooterButton />} onCancel={onCancel}>
      <Form {...formItemLayout}>
        <CreateOrUpdateForm data={data} setData={setData} />
      </Form>
    </Modal>
  );
};
