import React from 'react';
import { Input, Form, Select } from 'antd';
import { customerStatus, customerType, Customer } from '@services/gql/customer';

const FormItem = Form.Item;
const Option = Select.Option;

interface IStatusProps {
  status: customerStatus;
  setStatus: (status: customerStatus) => void;
  disabled?: boolean;
}

const StatusSelect = (props: IStatusProps) => {
  const { status, setStatus, disabled } = props;
  const statusOption = {
    [customerStatus.INACTIVE]: '停用',
    [customerStatus.ACTIVE]: '激活'
  };
  return (
    <Select value={status || customerStatus.ACTIVE} onChange={setStatus} disabled={disabled}>
      {Object.keys(statusOption).map(key => (
        <Option key={key} value={key}>
          {statusOption[key]}
        </Option>
      ))}
    </Select>
  );
};

interface ITypeProps {
  type: customerType;
  setType: (type: customerType) => void;
}

const TypeSelect = (props: ITypeProps) => {
  const { type, setType } = props;
  const typeOption = {
    [customerType.NORMAL]: '普通用户',
    [customerType.VIP]: 'VIP',
    [customerType.SVIP]: 'SVIP'
  };
  return (
    <Select value={type || customerType.NORMAL} onChange={setType}>
      {Object.keys(typeOption).map(key => (
        <Option key={key} value={key}>
          {typeOption[key]}
        </Option>
      ))}
    </Select>
  );
};

interface IFormProps {
  data: Partial<Customer>;
  setData: (value: React.SetStateAction<Partial<Customer>>) => void;
}

export const CreateOrUpdateForm = (props: IFormProps) => {
  const { data, setData } = props;
  return (
    <>
      <FormItem label="客户名称" required>
        <Input
          placeholder="输入客户名称"
          value={data.name}
          onChange={e => setData(Object.assign({}, data, { name: e.target.value }))}
        />
      </FormItem>
      <FormItem label="客户电话" required>
        <Input
          placeholder="输入客户电话"
          value={data.phone}
          onChange={e => setData(Object.assign({}, data, { phone: e.target.value }))}
        />
      </FormItem>
      <FormItem label="客户地址" required>
        <Input
          placeholder="输入客户地址"
          value={data.address}
          onChange={e => setData(Object.assign({}, data, { address: e.target.value }))}
        />
      </FormItem>
      <FormItem label="负责人姓名" required>
        <Input
          placeholder="输入负责人姓名"
          value={data.manageName}
          onChange={e => setData(Object.assign({}, data, { manageName: e.target.value }))}
        />
      </FormItem>
      <FormItem label="负责人电话" required>
        <Input
          placeholder="输入负责人电话"
          value={data.managePhone}
          onChange={e => setData(Object.assign({}, data, { managePhone: e.target.value }))}
        />
      </FormItem>
      <FormItem label="客户类型" required>
        <TypeSelect type={data.type} setType={type => setData(Object.assign({}, data, { type }))} />
      </FormItem>
      <FormItem label="客户状态" required>
        <StatusSelect
          disabled={!!data.id}
          status={data.status}
          setStatus={status => setData(Object.assign({}, data, { status }))}
        />
      </FormItem>
    </>
  );
};
