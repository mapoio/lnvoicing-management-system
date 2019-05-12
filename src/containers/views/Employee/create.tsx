import React from 'react';
import { Button, Modal, Form } from 'antd';
import { EmployeeStore } from '@store/employee';
import { useCreateOrUpdateState } from '@components/UseStates';
import { EmployeeCoreData } from '@services/gql/employee';
import { CreateOrUpdateForm } from './form';
import { formItemLayout } from '@constants/index';

const { dispatch } = EmployeeStore;

interface ICreateEmployee {
  show: boolean;
  onShow: (show: boolean) => void;
}

export const CreateModal = (props: ICreateEmployee) => {
  const initData: Partial<EmployeeCoreData> = {
    name: '',
    phone: undefined
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
          创建员工
        </Button>
      </div>
    );
  };
  return (
    <Modal title="创建员工" visible={props.show} footer={<FooterButton />} onCancel={onCancel}>
      <Form {...formItemLayout}>
        <CreateOrUpdateForm data={data} setData={setData} />
      </Form>
    </Modal>
  );
};
