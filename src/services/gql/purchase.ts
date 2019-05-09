import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';
import { Purchaseitem, purchaseitemGraphQLString } from './purchaseitem';
import { supplierGraphQLString, Supplier } from './supplier';

export enum purchaseStatus {
  BUILDED = 'BUILDED',
  CONFIRM = 'CONFIRM',
  STOCKIN = 'STOCKIN',
  INVAILD = 'INVAILD'
}

export interface Purchase extends BaseModel {
  batch: string;
  remark: string;
  money: number;
  status: purchaseStatus;
  purchaseitems: Purchaseitem[];
  supplier: Supplier;
}

export interface ICreatePurchase {
  batch: string;
  remark: string;
  money: number;
  status: purchaseStatus;
  purchaseitems: any;
  supplier: string;
}

export type PurchaseCoreData = Pick<Purchase, Exclude<keyof Purchase, 'id' | 'created_at' | 'updated_at'>>;

export interface OnePurchase {
  purchase?: Purchase;
}

export interface Purchases {
  purchases?: Purchase[];
}

export type GetPurchasesData = GraphQLData<Purchases>;

export interface GetPurchasesParams {
  limit: number;
}

export const purchaseCoreGraphQLString = `
id
batch
remark
money
status
created_at
updated_at
`;

export const purchaseGraphQLString = `
${purchaseCoreGraphQLString}
supplier {
  ${supplierGraphQLString}
}
purchaseitems {
  ${purchaseitemGraphQLString}
}
`;

export class GetPurchases extends GraphQLHttp<GetPurchasesData, GetPurchasesParams> {
  public variables: GetPurchasesParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      purchases(limit: $limit) {
        ${purchaseGraphQLString}
      }
    }
  `;
}

type TDeletePurchaseData = {
  deletePurchase: OnePurchase;
};

export type DeletePurchaseData = GraphQLData<TDeletePurchaseData>;

export interface DeletePurchaseParams {
  id: string;
}

export class DeletePurchase extends GraphQLHttp<DeletePurchaseData, DeletePurchaseParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deletePurchase(input: { where: { id: $id } }) {
        purchase {
          remark
        }
      }
    }
  `;
}

type TUpdatePurchaseData = {
  updatePurchase: OnePurchase;
};

export type UpdatePurchaseData = GraphQLData<TUpdatePurchaseData>;

export type UpdatePurchaseParamsData = PurchaseCoreData;

interface IUpdatePurchaseParams {
  id: string;
  data: UpdatePurchaseParamsData;
}

export class UpdatePurchase extends GraphQLHttp<UpdatePurchaseData, IUpdatePurchaseParams> {
  public query = gql`
    mutation update($id: ID!, $data: editPurchaseInput!) {
      updatePurchase(input: { where: { id: $id }, data: $data }) {
        purchase {
          ${purchaseGraphQLString}
        }
      }
    }
  `;
}

type TCreatePurchaseData = {
  createPurchase: OnePurchase;
};

export type createPurchaseData = GraphQLData<TCreatePurchaseData>;

export type CreatePurchaseParamsData = PurchaseCoreData;

interface ICreatePurchaseParams {
  data: ICreatePurchase;
}

export class CreatePurchase extends GraphQLHttp<createPurchaseData, ICreatePurchaseParams> {
  public query = gql`
    mutation create($data: PurchaseInput!) {
      createPurchase(input: { data: $data }) {
        purchase {
          ${purchaseGraphQLString}
        }
      }
    }
  `;
}
