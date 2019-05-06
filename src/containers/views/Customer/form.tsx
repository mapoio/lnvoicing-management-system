import React from 'react';
import { Input, Form, Select } from 'antd';
import { CustomerCoreData, customerStatus, customerType } from '@services/gql/customer';

const FormItem = Form.Item;
const Option = Select.Option;

interface IStatusProps {
  status: customerStatus;
  setStatus: (status: customerStatus) => void;
}

const StatusSelect = (props: IStatusProps) => {
  const { status, setStatus } = props;
  const statusOption = {
    [customerStatus.INACTIVE]: '停用',
    [customerStatus.ACTIVE]: '激活'
  };
  return (
    <Select value={statusOption[status] || 'ACTIVE'} onChange={setStatus} disabled={!!statusOption[status]}>
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
    <Select value={typeOption[type] || 'NORMAL'} onChange={setType}>
      {Object.keys(typeOption).map(key => (
        <Option key={key} value={key}>
          {typeOption[key]}
        </Option>
      ))}
    </Select>
  );
};

interface IFormProps {
  data: Partial<CustomerCoreData>;
  setData: (value: React.SetStateAction<Partial<CustomerCoreData>>) => void;
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
        <StatusSelect status={data.status} setStatus={status => setData(Object.assign({}, data, { status }))} />
      </FormItem>
    </>
  );
};
