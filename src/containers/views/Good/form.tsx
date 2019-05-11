import React from 'react';
import { Input, Form, Select, InputNumber } from 'antd';
import { goodStatus, Good } from '@services/gql/good';
import { Brand } from '@services/gql/brand';
import { BrandStore } from '@store/brand';
import { ModelStore } from '@store/model';
import { searchItem } from '@utils/index';
import { Model } from '@services/gql/model';

const FormItem = Form.Item;
const Option = Select.Option;

interface IStatusProps {
  status: goodStatus;
  setStatus: (status: goodStatus) => void;
  disabled?: boolean;
}

const StatusSelect = (props: IStatusProps) => {
  const { status, setStatus, disabled } = props;
  const statusOption = {
    [goodStatus.INACTIVE]: '停用',
    [goodStatus.ACTIVE]: '激活'
  };
  return (
    <Select value={status || goodStatus.ACTIVE} onChange={setStatus} disabled={disabled}>
      {Object.keys(statusOption).map(key => (
        <Option key={key} value={key}>
          {statusOption[key]}
        </Option>
      ))}
    </Select>
  );
};

interface IBrandSelect {
  brand: Brand;
  setBrand: (brand: Brand) => void;
}

const BrandSelect = (props: IBrandSelect) => {
  const { brand, setBrand } = props;
  const brandStore = BrandStore.useStore(s => s.list);
  if (brandStore.length < 1) {
    BrandStore.dispatch('getList', 500);
  }
  const index = searchItem(brand && brand.id, brandStore).index;
  const setData = (brandStr: string) => setBrand(JSON.parse(brandStr));
  return (
    <Select value={JSON.stringify(brandStore[index] || brandStore[0])} onChange={setData}>
      {brandStore.map(key => (
        <Option key={key.id} value={JSON.stringify(key)}>
          {key.id}-{key.name}
        </Option>
      ))}
    </Select>
  );
};

interface IModelSelect {
  model: Model;
  setModel: (model: Model) => void;
}

const ModelSelect = (props: IModelSelect) => {
  const { model, setModel } = props;
  const modelStore = ModelStore.useStore(s => s.list);
  if (modelStore.length < 1) {
    ModelStore.dispatch('getList', 500);
  }
  const index = searchItem(model && model.id, modelStore).index;
  const setData = (modelStr: string) => setModel(JSON.parse(modelStr));
  return (
    <Select value={JSON.stringify(modelStore[index] || modelStore[0])} onChange={setData}>
      {modelStore.map(key => (
        <Option key={key.id} value={JSON.stringify(key)}>
          {key.id}-{key.name}
        </Option>
      ))}
    </Select>
  );
};

interface IFormProps {
  data: Partial<Good>;
  setData: (value: React.SetStateAction<Partial<Good>>) => void;
}

export const CreateOrUpdateForm = (props: IFormProps) => {
  const { data, setData } = props;
  return (
    <>
      <FormItem label="规格" required>
        <Input
          placeholder="输入规格"
          value={data.specification}
          onChange={e => setData(Object.assign({}, data, { specification: e.target.value }))}
        />
      </FormItem>
      <FormItem label="花纹" required>
        <Input
          placeholder="输入花纹"
          value={data.pattern}
          onChange={e => setData(Object.assign({}, data, { pattern: e.target.value }))}
        />
      </FormItem>
      <FormItem label="载重指数" required>
        <InputNumber
          placeholder="输入载重指数"
          value={data.loadIndex}
          onChange={e => setData(Object.assign({}, data, { loadIndex: e }))}
        />
      </FormItem>
      <FormItem label="速度级别" required>
        <Input
          placeholder="输入速度级别"
          value={data.speedLevel}
          onChange={e => setData(Object.assign({}, data, { speedLevel: e.target.value }))}
        />
      </FormItem>
      <FormItem label="单位" required>
        <Input
          placeholder="输入单位"
          value={data.unit}
          onChange={e => setData(Object.assign({}, data, { unit: e.target.value }))}
        />
      </FormItem>
      <FormItem label="类型" required>
        <ModelSelect model={data.model} setModel={model => setData(Object.assign({}, data, { model }))} />
      </FormItem>
      <FormItem label="品牌" required>
        <BrandSelect brand={data.brand} setBrand={brand => setData(Object.assign({}, data, { brand }))} />
      </FormItem>
      <FormItem label="商品状态" required>
        <StatusSelect
          disabled={!!data.id}
          status={data.status}
          setStatus={status => setData(Object.assign({}, data, { status }))}
        />
      </FormItem>
    </>
  );
};
