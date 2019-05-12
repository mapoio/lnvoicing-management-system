import React from 'react';
import { Button, Modal, Form, message } from 'antd';
import { EmployeeStore } from '@store/employee';
import { formItemLayout } from '@constants/index';
import { Employee } from '@services/gql/employee';
import { useCreateOrUpdateState } from '@components/UseStates';
import { CreateOrUpdateForm } from './form';

const FormItem = Form.Item;
const { dispatch } = EmployeeStore;

interface IUpdateEmployee {
  show: boolean;
  onShow: (show: boolean) => void;
  data: Employee;
}

export const UpdateModal = (props: IUpdateEmployee) => {
  const { data, setData, loading, setLoading } = useCreateOrUpdateState(props.data);
  const onCancel = () => {
    setData(props.data);
    props.onShow(false);
  };
  const onOK = async () => {
    setLoading(true);
    await dispatch('update', data);
    message.success('修改员工成功');
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
    <Modal title="修改员工" visible={props.show} footer={<FooterButton />} onCancel={onCancel}>
      <Form {...formItemLayout}>
        <FormItem label="唯一ID" required>
          <span>{data.id}</span>
        </FormItem>
        <CreateOrUpdateForm data={data} setData={setData} />
      </Form>
    </Modal>
  );
};
