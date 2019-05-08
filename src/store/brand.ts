import { createStore } from 'react-state-manage';
import { GetBrands, Brand, DeleteBrand, CreateBrandParamsData, CreateBrand, UpdateBrand } from '@services/gql/brand';
import { handleGraphQLError } from '@utils/index';

interface IState {
  list: Brand[];
}

const initState: IState = {
  list: []
};

const LIST = new GetBrands();
const DELETE = new DeleteBrand();
const CREATE = new CreateBrand();
const UPDATE = new UpdateBrand();

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    updateList(state, payload: Brand[]) {
      state.list = state.list = payload || [];
    },
    delete(state, payload: string) {
      const index = state.list.findIndex(item => item.id === payload);
      if (index > -1) {
        state.list.splice(index, 1);
      }
    },
    updateOne(state, payload: Brand) {
      const index = state.list.findIndex(item => item.id === payload.id);
      if (index > -1) {
        state.list[index] = payload;
      }
    },
    createOne(state, payload: Brand) {
      state.list.push(payload);
    }
  },
  effects: {
    async getList(limit: number) {
      const data = handleGraphQLError(await LIST.send({ limit: limit || 5 }));
      dispatch('updateList', data.data.brands);
    },
    async deleteSingle(id: string) {
      handleGraphQLError(await DELETE.send({ id }));
      dispatch('delete', id);
    },
    async create(data: CreateBrandParamsData) {
      const res = handleGraphQLError(await CREATE.send({ data }));
      dispatch('createOne', res.data.createBrand.brand);
    },
    async update(item: Brand) {
      const { id, created_at, updated_at, ...data } = item;
      const res = handleGraphQLError(await UPDATE.send({ data, id }));
      dispatch('updateOne', res.data.updateBrand.brand);
    }
  }
});

export const BrandStore = { useStore, dispatch };
