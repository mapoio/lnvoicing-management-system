import React from 'react';
import { Customer, customerStatus } from '@services/gql/customer';
import { CustomerStore } from '@store/customer';
import { searchItem } from '@utils/index';
import { Select } from 'antd';

const Option = Select.Option;

interface ICustomerSelect {
  customer: Customer;
  setCustomer: (customer: Customer) => void;
  active?: boolean;
}

export const CustomerSelect = (props: ICustomerSelect) => {
  const { customer, setCustomer, active } = props;
  const customerStore = CustomerStore.useStore(s => s.list).filter(item => {
    if (!active) {
      return true;
    } else {
      return item.status === customerStatus.ACTIVE;
    }
  });
  if (customerStore.length < 1) {
    CustomerStore.dispatch('getList', 500);
  }
  const index = searchItem(customer && customer.id, customerStore).index;
  const setData = (customerStr: string) => setCustomer(JSON.parse(customerStr));
  return (
    <Select value={customerStore[index] ? JSON.stringify(customerStore[index]) : '请选择客户'} onChange={setData}>
      {customerStore.map(key => (
        <Option key={key.id} value={JSON.stringify(key)}>
          {key.id}-{key.name}
        </Option>
      ))}
    </Select>
  );
};
