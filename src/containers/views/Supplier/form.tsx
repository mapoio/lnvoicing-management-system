import React from 'react';
import { Input, Form, Select } from 'antd';
import { SupplierCoreData, supplierStatus, supplierType } from '@services/gql/supplier';

const FormItem = Form.Item;
const Option = Select.Option;

interface IStatusProps {
  status: supplierStatus;
  setStatus: (status: supplierStatus) => void;
}

const StatusSelect = (props: IStatusProps) => {
  const { status, setStatus } = props;
  const statusOption = {
    [supplierStatus.INACTIVE]: '停用',
    [supplierStatus.ACTIVE]: '激活'
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
  type: supplierType;
  setType: (type: supplierType) => void;
}

const TypeSelect = (props: ITypeProps) => {
  const { type, setType } = props;
  const typeOption = {
    [supplierType.HIGH]: '高级',
    [supplierType.MIDDLE]: '中等',
    [supplierType.LOW]: '初级'
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
  data: Partial<SupplierCoreData>;
  setData: (value: React.SetStateAction<Partial<SupplierCoreData>>) => void;
}

export const CreateOrUpdateForm = (props: IFormProps) => {
  const { data, setData } = props;
  return (
    <>
      <FormItem label="供应商名称" required>
        <Input
          placeholder="输入供应商名称"
          value={data.name}
          onChange={e => setData(Object.assign({}, data, { name: e.target.value }))}
        />
      </FormItem>
      <FormItem label="供应商电话" required>
        <Input
          placeholder="输入供应商电话"
          value={data.phone}
          onChange={e => setData(Object.assign({}, data, { phone: e.target.value }))}
        />
      </FormItem>
      <FormItem label="供应商地址" required>
        <Input
          placeholder="输入供应商地址"
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
      <FormItem label="供应商类型" required>
        <TypeSelect type={data.type} setType={type => setData(Object.assign({}, data, { type }))} />
      </FormItem>
      <FormItem label="供应商状态" required>
        <StatusSelect status={data.status} setStatus={status => setData(Object.assign({}, data, { status }))} />
      </FormItem>
    </>
  );
};
