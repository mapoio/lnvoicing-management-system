import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';
import { Good, goodGraphQLString } from './good';
import { Stock } from './stock';

export enum saleitemStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Saleitem extends BaseModel {
  price: number;
  amount: number;
  status: saleitemStatus;
  good: Good;
  stocks: Stock[];
}

export interface ICreateSaleitem {
  price: number;
  amount: number;
  status: saleitemStatus;
  good: string;
  sale: string;
}

export type SaleitemCoreData = Pick<Saleitem, Exclude<keyof Saleitem, 'id' | 'created_at' | 'updated_at'>>;

export interface OneSaleitem {
  saleitem?: Saleitem;
}

export interface Saleitems {
  saleitems?: Saleitem[];
}

export type GetSaleitemsData = GraphQLData<Saleitems>;

export interface GetSaleitemsParams {
  limit: number;
}

export const saleitemCoreGraphQLString = `
id
price
amount
status
created_at
updated_at
`;

export const saleitemGraphQLString = `
${saleitemCoreGraphQLString}
good {
  ${goodGraphQLString}
}
stocks {
  id
  goodsCode
  status
  created_at
  updated_at
}
`;

export class GetSaleitems extends GraphQLHttp<GetSaleitemsData, GetSaleitemsParams> {
  public variables: GetSaleitemsParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      saleitems(limit: $limit, sort: "updated_at:desc") {
        ${saleitemGraphQLString}
      }
    }
  `;
}

type TDeleteSaleitemData = {
  deleteSaleitem: OneSaleitem;
};

export type DeleteSaleitemData = GraphQLData<TDeleteSaleitemData>;

export interface DeleteSaleitemParams {
  id: string;
}

export class DeleteSaleitem extends GraphQLHttp<DeleteSaleitemData, DeleteSaleitemParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deleteSaleitem(input: { where: { id: $id } }) {
        saleitem {
          address
        }
      }
    }
  `;
}

type TUpdateSaleitemData = {
  updateSaleitem: OneSaleitem;
};

export type UpdateSaleitemData = GraphQLData<TUpdateSaleitemData>;

export type UpdateSaleitemParamsData = SaleitemCoreData;

interface IUpdateSaleitemParams {
  id: string;
  data: UpdateSaleitemParamsData;
}

export class UpdateSaleitem extends GraphQLHttp<UpdateSaleitemData, IUpdateSaleitemParams> {
  public query = gql`
    mutation update($id: ID!, $data: editSaleitemInput!) {
      updateSaleitem(input: { where: { id: $id }, data: $data }) {
        saleitem {
          ${saleitemGraphQLString}
        }
      }
    }
  `;
}

type TCreateSaleitemData = {
  createSaleitem: OneSaleitem;
};

export type createSaleitemData = GraphQLData<TCreateSaleitemData>;

export type CreateSaleitemParamsData = SaleitemCoreData;

interface ICreateSaleitemParams {
  data: ICreateSaleitem;
}

export class CreateSaleitem extends GraphQLHttp<createSaleitemData, ICreateSaleitemParams> {
  public query = gql`
    mutation create($data: SaleitemInput!) {
      createSaleitem(input: { data: $data }) {
        saleitem {
          ${saleitemGraphQLString}
        }
      }
    }
  `;
}
