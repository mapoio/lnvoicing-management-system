import React from 'react';
import { Button, Modal, Form } from 'antd';
import { GoodStore } from '@store/good';
import { useCreateOrUpdateState } from '@components/UseStates';
import { GoodCoreData } from '@services/gql/good';
import { CreateOrUpdateForm } from './form';
import { formItemLayout } from '@constants/index';

const { dispatch } = GoodStore;

interface ICreateGood {
  show: boolean;
  onShow: (show: boolean) => void;
}

export const CreateModal = (props: ICreateGood) => {
  const initData: Partial<GoodCoreData> = {
    unit: ''
  };
  const { data, setData, loading, setLoading } = useCreateOrUpdateState(initData);
  const onCancel = () => {
    setData(initData);
    props.onShow(false);
  };
  const onOK = async () => {
    setLoading(true);
    await dispatch('create', Object.assign({}, data, { model: data.model.id, brand: data.brand.id }));
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
          创建商品
        </Button>
      </div>
    );
  };
  return (
    <Modal title="创建商品" visible={props.show} footer={<FooterButton />} onCancel={onCancel}>
      <Form {...formItemLayout}>
        <CreateOrUpdateForm data={data} setData={setData} />
      </Form>
    </Modal>
  );
};
