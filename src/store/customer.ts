import { createStore } from 'react-state-manage';
import {
  GetCustomers,
  Customer,
  DeleteCustomer,
  CreateCustomerParamsData,
  CreateCustomer,
  UpdateCustomer
} from '@services/gql/customer';
import { handleGraphQLError } from '@utils/index';

interface IState {
  list: Customer[];
}

const initState: IState = {
  list: []
};

const LIST = new GetCustomers();
const DELETE = new DeleteCustomer();
const CREATE = new CreateCustomer();
const UPDATE = new UpdateCustomer();

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    updateList(state, payload: Customer[]) {
      const list = payload || [];
      state.list = state.list.concat(list);
    },
    delete(state, payload: number) {
      const index = state.list.findIndex(item => item.id === payload);
      if (index > -1) {
        state.list.splice(index, 1);
      }
    },
    updateOne(state, payload: Customer) {
      const index = state.list.findIndex(item => item.id === payload.id);
      if (index > -1) {
        state.list[index] = payload;
      }
    },
    createOne(state, payload: Customer) {
      state.list.push(payload);
    }
  },
  effects: {
    async getList(limit: number) {
      const data = handleGraphQLError(await LIST.send({ limit: limit || 5 }));
      dispatch('updateList', data.data.customers);
    },
    async deleteSingle(id: number) {
      handleGraphQLError(await DELETE.send({ id }));
      dispatch('delete', id);
    },
    async create(data: CreateCustomerParamsData) {
      const res = handleGraphQLError(await CREATE.send({ data }));
      dispatch('createOne', res.data.createCustomer.customer);
    },
    async update(item: Customer) {
      const { id, created_at, updated_at, ...data } = item;
      const res = handleGraphQLError(await UPDATE.send({ data, id }));
      dispatch('updateOne', res.data.updateCustomer.customer);
    }
  }
});

export const CustomerStore = { useStore, dispatch };
