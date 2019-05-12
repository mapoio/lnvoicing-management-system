import React from 'react';
import { Input, Form, Select } from 'antd';
import { EmployeeRole, employeeType, Employee } from '@services/gql/employee';

const FormItem = Form.Item;
const Option = Select.Option;

interface IRoleProps {
  role: EmployeeRole;
  setRole: (role: EmployeeRole) => void;
  disabled?: boolean;
}

const RoleSelect = (props: IRoleProps) => {
  const { role, setRole, disabled } = props;
  const roleOption = {
    [EmployeeRole.ADMIN]: '管理',
    [EmployeeRole.PURCHASE]: '采购',
    [EmployeeRole.RESALE]: '售后',
    [EmployeeRole.SALE]: '销售',
    [EmployeeRole.STOCK]: '仓库',
    [EmployeeRole.USER]: '用户'
  };
  return (
    <Select value={roleOption[role] || EmployeeRole.ADMIN} onChange={setRole} disabled={disabled}>
      {Object.keys(roleOption).map(key => (
        <Option key={key} value={key}>
          {roleOption[key]}
        </Option>
      ))}
    </Select>
  );
};

interface ITypeProps {
  type: employeeType;
  setType: (type: employeeType) => void;
}

const TypeSelect = (props: ITypeProps) => {
  const { type, setType } = props;
  const typeOption = {
    [employeeType.INTERN]: '实习员工',
    [employeeType.OUTWORKER]: '外包员工',
    [employeeType.REGULAI]: '正式员工'
  };
  return (
    <Select value={type || employeeType.OUTWORKER} onChange={setType}>
      {Object.keys(typeOption).map(key => (
        <Option key={key} value={key}>
          {typeOption[key]}
        </Option>
      ))}
    </Select>
  );
};

interface IFormProps {
  data: Partial<Employee>;
  setData: (value: React.SetStateAction<Partial<Employee>>) => void;
}

export const CreateOrUpdateForm = (props: IFormProps) => {
  const { data, setData } = props;
  return (
    <>
      <FormItem label="员工名称" required>
        <Input
          placeholder="输入员工名称"
          value={data.name}
          onChange={e => setData(Object.assign({}, data, { name: e.target.value }))}
        />
      </FormItem>
      <FormItem label="员工电话" required>
        <Input
          placeholder="输入员工电话"
          value={data.phone}
          onChange={e => setData(Object.assign({}, data, { phone: e.target.value }))}
        />
      </FormItem>
      {/* <FormItem label="员工地址" required>
        <Input
          placeholder="输入员工地址"
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
      </FormItem> */}
      <FormItem label="员工类型" required>
        <TypeSelect type={data.type} setType={type => setData(Object.assign({}, data, { type }))} />
      </FormItem>
      <FormItem label="员工权限" required>
        <RoleSelect
          disabled={!!data.id}
          role={data.role}
          setRole={role => setData(Object.assign({}, data, { role }))}
        />
      </FormItem>
    </>
  );
};
