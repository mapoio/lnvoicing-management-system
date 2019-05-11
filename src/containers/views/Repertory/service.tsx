import React from 'react';
import { Repertory, repertoryStatus } from '@services/gql/repertory';
import { RepertoryStore } from '@store/repertory';
import { searchItem } from '@utils/index';
import { Select } from 'antd';

const Option = Select.Option;

interface IRepertorySelect {
  repertory: Repertory;
  setRepertory: (repertory: Repertory) => void;
  active?: boolean;
}

export const RepertorySelect = (props: IRepertorySelect) => {
  const { repertory, setRepertory, active } = props;
  const repertoryStore = RepertoryStore.useStore(s => s.list).filter(item => {
    if (!active) {
      return true;
    } else {
      return item.status === repertoryStatus.ACTIVE;
    }
  });
  if (repertoryStore.length < 1) {
    RepertoryStore.dispatch('getList', 500);
  }
  const index = searchItem(repertory && repertory.id, repertoryStore).index;
  const setData = (repertoryStr: string) => setRepertory(JSON.parse(repertoryStr));
  return (
    <Select value={repertoryStore[index] ? JSON.stringify(repertoryStore[index]) : '请选择仓库'} onChange={setData}>
      {repertoryStore.map(key => (
        <Option key={key.id} value={JSON.stringify(key)}>
          {key.id}-{key.name}
        </Option>
      ))}
    </Select>
  );
};
