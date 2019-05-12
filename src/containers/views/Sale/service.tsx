import React from 'react';
import { Sale, saleStatus } from '@services/gql/sale';
import { SaleStore } from '@store/sale';
import { searchItem } from '@utils/index';
import { Select } from 'antd';

const Option = Select.Option;

interface ISaleSelect {
  sale: Sale;
  setSale: (sale: Sale) => void;
  active?: boolean;
  filter?: (sale: Sale) => boolean;
}

export const SaleSelect = (props: ISaleSelect) => {
  const { sale, setSale, active, filter } = props;
  const saleStore = SaleStore.useStore(s => s.list)
    .filter(item => {
      if (!active) {
        return true;
      } else {
        return item.status === saleStatus.CONFIRM;
      }
    })
    .filter(item => (filter ? filter(item) : true));
  if (SaleStore.useStore(s => s.list).length < 1) {
    SaleStore.dispatch('getList', 500);
  }
  const index = searchItem(sale && sale.id, saleStore).index;
  const setData = (saleStr: string) => setSale(JSON.parse(saleStr));
  return (
    <Select value={saleStore[index] ? JSON.stringify(saleStore[index]) : '请选择销售单'} onChange={setData}>
      {saleStore.map(key => (
        <Option key={key.id} value={JSON.stringify(key)}>
          {key.id}-{key.batch}
        </Option>
      ))}
    </Select>
  );
};
