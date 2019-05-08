import React from 'react';
import { Button, Modal, Form } from 'antd';
import { RepertoryStore } from '@store/repertory';
import { useCreateOrUpdateState } from '@components/UseStates';
import { RepertoryCoreData } from '@services/gql/repertory';
import { CreateOrUpdateForm } from './form';
import { formItemLayout } from '@constants/index';

const { dispatch } = RepertoryStore;

interface ICreateRepertory {
  show: boolean;
  onShow: (show: boolean) => void;
}

export const CreateModal = (props: ICreateRepertory) => {
  const initData: Partial<RepertoryCoreData> = {
    name: '',
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
          创建仓库
        </Button>
      </div>
    );
  };
  return (
    <Modal title="创建仓库" visible={props.show} footer={<FooterButton />} onCancel={onCancel}>
      <Form {...formItemLayout}>
        <CreateOrUpdateForm data={data} setData={setData} />
      </Form>
    </Modal>
  );
};
