import React from 'react';
import { Button, Modal, Form } from 'antd';
import { PurchaseStore } from '@store/purchase';
import { useCreateOrUpdateState } from '@components/UseStates';
import { PurchaseCoreData } from '@services/gql/purchase';
import { CreateOrUpdateForm } from './form';
import { formItemLayout } from '@constants/index';

const { dispatch } = PurchaseStore;

interface ICreatePurchase {
  show: boolean;
  onShow: (show: boolean) => void;
}

export const CreateModal = (props: ICreatePurchase) => {
  const initData: Partial<PurchaseCoreData> = {
    batch: ''
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
          创建采购单
        </Button>
      </div>
    );
  };
  return (
    <Modal title="创建采购单" visible={props.show} footer={<FooterButton />} onCancel={onCancel}>
      <Form {...formItemLayout}>
        <CreateOrUpdateForm data={data} setData={setData} />
      </Form>
    </Modal>
  );
};
