import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';
import { Saleitem, saleitemGraphQLString } from './saleitem';
import { customerGraphQLString, Customer } from './customer';

export enum saleStatus {
  BUILDED = 'BUILDED',
  CONFIRM = 'CONFIRM',
  STOCKOUT = 'STOCKOUT',
  INVAILD = 'INVAILD'
}

export interface Sale extends BaseModel {
  batch: string;
  remark: string;
  money: number;
  status: saleStatus;
  saleitems: Saleitem[];
  customer: Customer;
}

export interface ICreateSale {
  batch: string;
  remark: string;
  money: number;
  status: saleStatus;
  saleitems: any;
  customer: string;
}

export type SaleCoreData = Pick<Sale, Exclude<keyof Sale, 'id' | 'created_at' | 'updated_at'>>;

export interface OneSale {
  sale?: Sale;
}

export interface Sales {
  sales?: Sale[];
}

export type GetSalesData = GraphQLData<Sales>;

export interface GetSalesParams {
  limit: number;
}

export const saleCoreGraphQLString = `
id
batch
remark
money
status
created_at
updated_at
`;

export const saleGraphQLString = `
${saleCoreGraphQLString}
customer {
  ${customerGraphQLString}
}
saleitems {
  ${saleitemGraphQLString}
}
`;

export class GetSales extends GraphQLHttp<GetSalesData, GetSalesParams> {
  public variables: GetSalesParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      sales(limit: $limit, sort: "updated_at:desc") {
        ${saleGraphQLString}
      }
    }
  `;
}

type TDeleteSaleData = {
  deleteSale: OneSale;
};

export type DeleteSaleData = GraphQLData<TDeleteSaleData>;

export interface DeleteSaleParams {
  id: string;
}

export class DeleteSale extends GraphQLHttp<DeleteSaleData, DeleteSaleParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deleteSale(input: { where: { id: $id } }) {
        sale {
          remark
        }
      }
    }
  `;
}

type TUpdateSaleData = {
  updateSale: OneSale;
};

export type UpdateSaleData = GraphQLData<TUpdateSaleData>;

export type UpdateSaleParamsData = SaleCoreData;

interface IUpdateSaleParams {
  id: string;
  data: UpdateSaleParamsData;
}

export class UpdateSale extends GraphQLHttp<UpdateSaleData, IUpdateSaleParams> {
  public query = gql`
    mutation update($id: ID!, $data: editSaleInput!) {
      updateSale(input: { where: { id: $id }, data: $data }) {
        sale {
          ${saleGraphQLString}
        }
      }
    }
  `;
}

type TCreateSaleData = {
  createSale: OneSale;
};

export type createSaleData = GraphQLData<TCreateSaleData>;

export type CreateSaleParamsData = SaleCoreData;

interface ICreateSaleParams {
  data: ICreateSale;
}

export class CreateSale extends GraphQLHttp<createSaleData, ICreateSaleParams> {
  public query = gql`
    mutation create($data: SaleInput!) {
      createSale(input: { data: $data }) {
        sale {
          ${saleGraphQLString}
        }
      }
    }
  `;
}
