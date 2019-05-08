import React from 'react';
import { Input, Form, Select } from 'antd';
import { repertoryStatus, Repertory } from '@services/gql/repertory';

const FormItem = Form.Item;
const Option = Select.Option;

interface IStatusProps {
  status: repertoryStatus;
  setStatus: (status: repertoryStatus) => void;
  disabled?: boolean;
}

const StatusSelect = (props: IStatusProps) => {
  const { status, setStatus, disabled } = props;
  const statusOption = {
    [repertoryStatus.INACTIVE]: '停用',
    [repertoryStatus.ACTIVE]: '激活'
  };
  return (
    <Select value={statusOption[status] || 'ACTIVE'} onChange={setStatus} disabled={disabled}>
      {Object.keys(statusOption).map(key => (
        <Option key={key} value={key}>
          {statusOption[key]}
        </Option>
      ))}
    </Select>
  );
};

interface IFormProps {
  data: Partial<Repertory>;
  setData: (value: React.SetStateAction<Partial<Repertory>>) => void;
}

export const CreateOrUpdateForm = (props: IFormProps) => {
  const { data, setData } = props;
  return (
    <>
      <FormItem label="仓库名称" required>
        <Input
          placeholder="输入仓库名称"
          value={data.name}
          onChange={e => setData(Object.assign({}, data, { name: e.target.value }))}
        />
      </FormItem>
      <FormItem label="仓库地址" required>
        <Input
          placeholder="输入仓库地址"
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
      <FormItem label="仓库状态" required>
        <StatusSelect
          disabled={!!data.id}
          status={data.status}
          setStatus={status => setData(Object.assign({}, data, { status }))}
        />
      </FormItem>
    </>
  );
};
