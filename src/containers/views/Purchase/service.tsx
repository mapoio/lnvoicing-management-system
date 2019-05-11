import React from 'react';
import { Purchase, purchaseStatus } from '@services/gql/purchase';
import { PurchaseStore } from '@store/purchase';
import { searchItem } from '@utils/index';
import { Select } from 'antd';

const Option = Select.Option;

interface IPurchaseSelect {
  purchase: Purchase;
  setPurchase: (purchase: Purchase) => void;
  active?: boolean;
  filter?: (resale: Purchase) => boolean;
}

export const PurchaseSelect = (props: IPurchaseSelect) => {
  const { purchase, setPurchase, active, filter } = props;
  const purchaseStore = PurchaseStore.useStore(s => s.list)
    .filter(item => {
      if (!active) {
        return true;
      } else {
        return item.status === purchaseStatus.CONFIRM;
      }
    })
    .filter(item => (filter ? filter(item) : true));
  if (PurchaseStore.useStore(s => s.list).length < 1) {
    PurchaseStore.dispatch('getList', 500);
  }
  const index = searchItem(purchase && purchase.id, purchaseStore).index;
  const setData = (purchaseStr: string) => setPurchase(JSON.parse(purchaseStr));
  return (
    <Select value={purchaseStore[index] ? JSON.stringify(purchaseStore[index]) : '请选择采购单'} onChange={setData}>
      {purchaseStore.map(key => (
        <Option key={key.id} value={JSON.stringify(key)}>
          {key.id}-{key.batch}
        </Option>
      ))}
    </Select>
  );
};
