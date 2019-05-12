import { createStore } from 'react-state-manage';
import {
  GetEmployees,
  Employee,
  DeleteEmployee,
  CreateEmployeeParamsData,
  CreateEmployee,
  UpdateEmployee
} from '@services/gql/employee';
import { handleGraphQLError } from '@utils/index';
import { CreateUser, User, UpdateUser } from '@services/gql/user';

interface IState {
  list: Employee[];
}

const initState: IState = {
  list: []
};

const LIST = new GetEmployees();
const DELETE = new DeleteEmployee();
const CREATE = new CreateEmployee();
const UPDATE = new UpdateEmployee();
const CREATE_USER = new CreateUser();
const UPDATE_USER = new UpdateUser();

const searchItem = <T extends any[]>(id: string, source: T) => {
  const index = source.findIndex(item => item.id === id);
  const data = source[index];
  return { index, data };
};

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    updateList(state, payload: Employee[]) {
      state.list = state.list = payload || [];
    },
    delete(state, payload: string) {
      const index = searchItem(payload, state.list).index;
      if (index > -1) {
        state.list.splice(index, 1);
      }
    },
    updateOne(state, payload: Employee) {
      const index = searchItem(payload.id, state.list).index;
      if (index > -1) {
        state.list[index] = payload;
      }
    },
    createOne(state, payload: Employee) {
      state.list = state.list.concat([payload]);
    }
  },
  effects: {
    async getList(limit: number) {
      const data = handleGraphQLError(await LIST.send({ limit: limit || 5 }));
      dispatch('updateList', data.data.employees);
    },
    async deleteSingle(id: string) {
      handleGraphQLError(await DELETE.send({ id }));
      dispatch('delete', id);
    },
    async create(data: CreateEmployeeParamsData) {
      const { user } = data;
      const userInfo = handleGraphQLError(await CREATE_USER.send({ data: user })).data.createUser.user;
      const res = handleGraphQLError(await CREATE.send({ data: { ...data, user: userInfo.id } }));
      dispatch('createOne', res.data.createEmployee.employee);
    },
    async update(item: Employee) {
      const { id, created_at, updated_at, user, ...data } = item;
      const userId = (user as User).id;
      (user as User).id = undefined;
      const userInfo = handleGraphQLError(await UPDATE_USER.send({ data: { ...(user as User) }, id: userId })).data
        .updateUser.user;
      const res = handleGraphQLError(await UPDATE.send({ data: { ...data, user: userInfo.id }, id }));
      dispatch('updateOne', res.data.updateEmployee.employee);
    }
  }
});

export const EmployeeStore = { useStore, dispatch };
