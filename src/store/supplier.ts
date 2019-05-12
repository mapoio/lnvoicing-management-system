import { createStore } from 'react-state-manage';
import {
  GetSuppliers,
  Supplier,
  DeleteSupplier,
  CreateSupplierParamsData,
  CreateSupplier,
  UpdateSupplier
} from '@services/gql/supplier';
import { handleGraphQLError } from '@utils/index';

interface IState {
  list: Supplier[];
}

const initState: IState = {
  list: []
};

const LIST = new GetSuppliers();
const DELETE = new DeleteSupplier();
const CREATE = new CreateSupplier();
const UPDATE = new UpdateSupplier();

const searchItem = <T extends any[]>(id: string, source: T) => {
  const index = source.findIndex(item => item.id === id);
  const data = source[index];
  return { index, data };
};

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    updateList(state, payload: Supplier[]) {
      state.list = state.list = payload || [];
    },
    delete(state, payload: string) {
      const index = searchItem(payload, state.list).index;
      if (index > -1) {
        state.list.splice(index, 1);
      }
    },
    updateOne(state, payload: Supplier) {
      const index = searchItem(payload.id, state.list).index;
      if (index > -1) {
        state.list[index] = payload;
      }
    },
    createOne(state, payload: Supplier) {
      state.list = state.list.concat([payload]);
    }
  },
  effects: {
    async getList(limit: number) {
      const data = handleGraphQLError(await LIST.send({ limit: limit || 5 }));
      dispatch('updateList', data.data.suppliers);
    },
    async deleteSingle(id: string) {
      handleGraphQLError(await DELETE.send({ id }));
      dispatch('delete', id);
    },
    async create(data: CreateSupplierParamsData) {
      const res = handleGraphQLError(await CREATE.send({ data }));
      dispatch('createOne', res.data.createSupplier.supplier);
    },
    async update(item: Supplier) {
      const { id, created_at, updated_at, ...data } = item;
      const res = handleGraphQLError(await UPDATE.send({ data, id }));
      dispatch('updateOne', res.data.updateSupplier.supplier);
    }
  }
});

export const SupplierStore = { useStore, dispatch };
