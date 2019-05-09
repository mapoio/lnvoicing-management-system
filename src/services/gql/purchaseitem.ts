import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';
import { Good, goodGraphQLString } from './good';

export enum purchaseitemStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Purchaseitem extends BaseModel {
  price: number;
  amount: number;
  status: purchaseitemStatus;
  good: Good;
}

export interface ICreatePurchaseitem {
  price: number;
  amount: number;
  status: purchaseitemStatus;
  good: string;
  purchase: string;
}

export type PurchaseitemCoreData = Pick<Purchaseitem, Exclude<keyof Purchaseitem, 'id' | 'created_at' | 'updated_at'>>;

export interface OnePurchaseitem {
  purchaseitem?: Purchaseitem;
}

export interface Purchaseitems {
  purchaseitems?: Purchaseitem[];
}

export type GetPurchaseitemsData = GraphQLData<Purchaseitems>;

export interface GetPurchaseitemsParams {
  limit: number;
}

export const purchaseitemCoreGraphQLString = `
id
price
amount
status
created_at
updated_at
`;

export const purchaseitemGraphQLString = `
${purchaseitemCoreGraphQLString}
good {
  ${goodGraphQLString}
}
`;

export class GetPurchaseitems extends GraphQLHttp<GetPurchaseitemsData, GetPurchaseitemsParams> {
  public variables: GetPurchaseitemsParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      purchaseitems(limit: $limit) {
        ${purchaseitemGraphQLString}
      }
    }
  `;
}

type TDeletePurchaseitemData = {
  deletePurchaseitem: OnePurchaseitem;
};

export type DeletePurchaseitemData = GraphQLData<TDeletePurchaseitemData>;

export interface DeletePurchaseitemParams {
  id: string;
}

export class DeletePurchaseitem extends GraphQLHttp<DeletePurchaseitemData, DeletePurchaseitemParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deletePurchaseitem(input: { where: { id: $id } }) {
        purchaseitem {
          address
        }
      }
    }
  `;
}

type TUpdatePurchaseitemData = {
  updatePurchaseitem: OnePurchaseitem;
};

export type UpdatePurchaseitemData = GraphQLData<TUpdatePurchaseitemData>;

export type UpdatePurchaseitemParamsData = PurchaseitemCoreData;

interface IUpdatePurchaseitemParams {
  id: string;
  data: UpdatePurchaseitemParamsData;
}

export class UpdatePurchaseitem extends GraphQLHttp<UpdatePurchaseitemData, IUpdatePurchaseitemParams> {
  public query = gql`
    mutation update($id: ID!, $data: editPurchaseitemInput!) {
      updatePurchaseitem(input: { where: { id: $id }, data: $data }) {
        purchaseitem {
          ${purchaseitemGraphQLString}
        }
      }
    }
  `;
}

type TCreatePurchaseitemData = {
  createPurchaseitem: OnePurchaseitem;
};

export type createPurchaseitemData = GraphQLData<TCreatePurchaseitemData>;

export type CreatePurchaseitemParamsData = PurchaseitemCoreData;

interface ICreatePurchaseitemParams {
  data: ICreatePurchaseitem;
}

export class CreatePurchaseitem extends GraphQLHttp<createPurchaseitemData, ICreatePurchaseitemParams> {
  public query = gql`
    mutation create($data: PurchaseitemInput!) {
      createPurchaseitem(input: { data: $data }) {
        purchaseitem {
          ${purchaseitemGraphQLString}
        }
      }
    }
  `;
}
