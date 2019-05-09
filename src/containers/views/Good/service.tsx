import React, { useState } from 'react';
import { Good, goodStatus } from '@services/gql/good';
import { GoodStore } from '@store/good';
import { searchItem } from '@utils/index';
import { AutoComplete as Select } from 'antd';

const Option = Select.Option;

interface IGoodSelect {
  good: Good;
  setGood: (good: Good) => void;
  active?: boolean;
}

export const GoodSelect = (props: IGoodSelect) => {
  const { good, setGood, active } = props;
  const [filter, setFilter] = useState('');
  const goodStore = GoodStore.useStore(s => s.list).filter(item => {
    if (!active) {
      return true;
    } else {
      return item.status === goodStatus.ACTIVE;
    }
  });
  if (goodStore.length < 1) {
    GoodStore.dispatch('getList', 500);
  }
  // const index = searchItem(good && good.id, goodStore).index;
  const setData = (goodStr: string) => setGood(JSON.parse(goodStr));
  return (
    <Select
      onSelect={setData}
      onSearch={value => setFilter(value)}
      dropdownMatchSelectWidth={true}
      style={{ width: '400px' }}
    >
      {goodStore.map(key =>
        JSON.stringify(key).includes(filter) ? (
          <Option key={key.id} value={JSON.stringify(key)}>
            {`${key.id}/${key.brand.name}/${key.model.name}/${key.pattern}/${key.specification}/${key.unit}`}
          </Option>
        ) : null
      )}
    </Select>
  );
};
