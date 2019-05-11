import React from 'react';
import { Resale, resaleStatus } from '@services/gql/resale';
import { ResaleStore } from '@store/resale';
import { searchItem } from '@utils/index';
import { Select } from 'antd';

const Option = Select.Option;

interface IResaleSelect {
  resale: Resale;
  setResale: (resale: Resale) => void;
  active?: boolean;
  filter?: (resale: Resale) => boolean;
}

export const ResaleSelect = (props: IResaleSelect) => {
  const { resale, setResale, active, filter } = props;
  const resaleStore = ResaleStore.useStore(s => s.list)
    .filter(item => {
      if (!active) {
        return true;
      } else {
        return item.status === resaleStatus.CONFIRM;
      }
    })
    .filter(item => (filter ? filter(item) : true));
  if (ResaleStore.useStore(s => s.list).length < 1) {
    ResaleStore.dispatch('getList', 500);
  }
  const index = searchItem(resale && resale.id, resaleStore).index;
  const setData = (resaleStr: string) => setResale(JSON.parse(resaleStr));
  return (
    <Select value={resaleStore[index] ? JSON.stringify(resaleStore[index]) : '请选择退货单'} onChange={setData}>
      {resaleStore.map(key => (
        <Option key={key.id} value={JSON.stringify(key)}>
          {key.id}-{key.batch}
        </Option>
      ))}
    </Select>
  );
};
