import React from 'react';
import { Input, Form, Select, InputNumber } from 'antd';
import { purchaseStatus, Purchase } from '@services/gql/purchase';

const FormItem = Form.Item;
const Option = Select.Option;

interface IStatusProps {
  status: purchaseStatus;
  setStatus: (status: purchaseStatus) => void;
  disabled?: boolean;
}

export const statusOption = {
  [purchaseStatus.BUILDED]: '已建立',
  [purchaseStatus.CONFIRM]: '已确认',
  [purchaseStatus.INVAILD]: '无效',
  [purchaseStatus.STOCKIN]: '已入库'
};

const StatusSelect = (props: IStatusProps) => {
  const { status, setStatus, disabled } = props;
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
  data: Partial<Purchase>;
  setData: (value: React.SetStateAction<Partial<Purchase>>) => void;
}

export const CreateOrUpdateForm = (props: IFormProps) => {
  const { data, setData } = props;
  return (
    <>
      <FormItem label="采购单名称" required>
        <Input
          placeholder="输入采购单批号"
          value={data.batch}
          onChange={e => setData(Object.assign({}, data, { batch: e.target.value }))}
        />
      </FormItem>
      <FormItem label="采购单金额" required>
        <InputNumber
          placeholder="输入采购单金额"
          value={data.money}
          onChange={money => setData(Object.assign({}, data, { money }))}
        />
      </FormItem>
      <FormItem label="采购单备注" required>
        <Input
          placeholder="输入采购单备注"
          value={data.remark}
          onChange={e => setData(Object.assign({}, data, { remark: e.target.value }))}
        />
      </FormItem>
      <FormItem label="采购单状态" required>
        <StatusSelect
          disabled={!!data.id}
          status={data.status}
          setStatus={status => setData(Object.assign({}, data, { status }))}
        />
      </FormItem>
    </>
  );
};
