import { createStore } from 'react-state-manage';
import {
  GetPurchases,
  Purchase,
  DeletePurchase,
  CreatePurchaseParamsData,
  CreatePurchase,
  UpdatePurchase,
  purchaseStatus
} from '@services/gql/purchase';
import { handleGraphQLError } from '@utils/index';
import dayjs from 'dayjs';
import { purchaseitemStatus, CreatePurchaseitem } from '@services/gql/purchaseitem';

interface IState {
  list: Purchase[];
}

const initState: IState = {
  list: []
};

const LIST = new GetPurchases();
const DELETE = new DeletePurchase();
const CREATE = new CreatePurchase();
const UPDATE = new UpdatePurchase();
const CREATEITEM = new CreatePurchaseitem();

const searchItem = <T extends any[]>(id: string, source: T) => {
  const index = source.findIndex(item => item.id === id);
  const data = source[index];
  return { index, data };
};

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    updateList(state, payload: Purchase[]) {
      state.list = state.list = payload || [];
    },
    delete(state, payload: string) {
      const index = searchItem(payload, state.list).index;
      if (index > -1) {
        state.list.splice(index, 1);
      }
    },
    updateOne(state, payload: Purchase) {
      const index = searchItem(payload.id, state.list).index;
      if (index > -1) {
        state.list[index] = payload;
      }
    },
    createOne(state, payload: Purchase) {
      state.list = state.list.concat([payload]);
    }
  },
  effects: {
    async getList(limit: number) {
      const data = handleGraphQLError(await LIST.send({ limit: limit || 5 }));
      dispatch('updateList', data.data.purchases);
    },
    async deleteSingle(id: string) {
      handleGraphQLError(await DELETE.send({ id }));
      dispatch('delete', id);
    },
    async create(data: CreatePurchaseParamsData) {
      const purchase = {
        batch: `CG${dayjs().format('YYMMDDHHmmss')}`,
        status: purchaseStatus.CONFIRM,
        money: data.purchaseitems.reduce((total, item) => (total += item.amount * item.price), 0),
        supplier: data.supplier.id,
        remark: data.remark,
        purchaseitems: []
      };
      const res = handleGraphQLError(await CREATE.send({ data: purchase }));
      const purchaseItems = data.purchaseitems.map(item => {
        return {
          price: item.price,
          amount: item.amount,
          status: purchaseitemStatus.ACTIVE,
          good: item.good.id,
          purchase: res.data.createPurchase.purchase.id
        };
      });
      const items = await Promise.all(
        purchaseItems.map(async item => {
          return handleGraphQLError(await CREATEITEM.send({ data: item })).data.createPurchaseitem.purchaseitem;
        })
      );
      const payload = res.data.createPurchase.purchase;
      payload.purchaseitems = items;
      dispatch('createOne', payload);
    },
    async update(item: Purchase) {
      const { id, created_at, updated_at, ...data } = item;
      const res = handleGraphQLError(await UPDATE.send({ data, id }));
      dispatch('updateOne', res.data.updatePurchase.purchase);
    }
  }
});

export const PurchaseStore = { useStore, dispatch };
