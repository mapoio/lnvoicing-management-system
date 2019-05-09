import React from 'react';
import { Supplier, supplierStatus } from '@services/gql/supplier';
import { SupplierStore } from '@store/supplier';
import { searchItem } from '@utils/index';
import { Select } from 'antd';

const Option = Select.Option;

interface ISupplierSelect {
  supplier: Supplier;
  setSupplier: (supplier: Supplier) => void;
  active?: boolean;
}

export const SupplierSelect = (props: ISupplierSelect) => {
  const { supplier, setSupplier, active } = props;
  const supplierStore = SupplierStore.useStore(s => s.list).filter(item => {
    if (!active) {
      return true;
    } else {
      return item.status === supplierStatus.ACTIVE;
    }
  });
  if (supplierStore.length < 1) {
    SupplierStore.dispatch('getList', 500);
  }
  const index = searchItem(supplier && supplier.id, supplierStore).index;
  const setData = (supplierStr: string) => setSupplier(JSON.parse(supplierStr));
  return (
    <Select value={supplierStore[index] ? JSON.stringify(supplierStore[index]) : '请选择供应商'} onChange={setData}>
      {supplierStore.map(key => (
        <Option key={key.id} value={JSON.stringify(key)}>
          {key.id}-{key.name}
        </Option>
      ))}
    </Select>
  );
};
