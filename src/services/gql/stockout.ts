import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';
import { Repertory, repertoryGraphQLString } from './repertory';
import { Sale, saleGraphQLString } from './sale';

export enum stockoutStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Stockout extends BaseModel {
  batch: string;
  remark: string;
  status: stockoutStatus;
  repertory: Repertory;
  sales: Sale[];
}

export interface ICreateStockout {
  batch: string;
  remark: string;
  status: stockoutStatus;
  repertory: string;
  sales: string[];
}

export type StockoutCoreData = Pick<Stockout, Exclude<keyof Stockout, 'id' | 'created_at' | 'updated_at'>>;

export interface OneStockout {
  stockout?: Stockout;
}

export interface Stockouts {
  stockouts?: Stockout[];
}

export type GetStockoutsData = GraphQLData<Stockouts>;

export interface GetStockoutsParams {
  limit: number;
}

export const stockoutCoreGraphQLString = `
id
batch
remark
status
created_at
updated_at
`;

export const stockoutGraphQLString = `
${stockoutCoreGraphQLString}
repertory {
  ${repertoryGraphQLString}
}
sales {
  ${saleGraphQLString}
}
`;

export class GetStockouts extends GraphQLHttp<GetStockoutsData, GetStockoutsParams> {
  public variables: GetStockoutsParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      stockouts(limit: $limit, sort: "updated_at:desc") {
        ${stockoutGraphQLString}
      }
    }
  `;
}

type TDeleteStockoutData = {
  deleteStockout: OneStockout;
};

export type DeleteStockoutData = GraphQLData<TDeleteStockoutData>;

export interface DeleteStockoutParams {
  id: string;
}

export class DeleteStockout extends GraphQLHttp<DeleteStockoutData, DeleteStockoutParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deleteStockout(input: { where: { id: $id } }) {
        stockout {
          remark
        }
      }
    }
  `;
}

type TUpdateStockoutData = {
  updateStockout: OneStockout;
};

export type UpdateStockoutData = GraphQLData<TUpdateStockoutData>;

export type UpdateStockoutParamsData = StockoutCoreData;

interface IUpdateStockoutParams {
  id: string;
  data: UpdateStockoutParamsData;
}

export class UpdateStockout extends GraphQLHttp<UpdateStockoutData, IUpdateStockoutParams> {
  public query = gql`
    mutation update($id: ID!, $data: editStockoutInput!) {
      updateStockout(input: { where: { id: $id }, data: $data }) {
        stockout {
          ${stockoutGraphQLString}
        }
      }
    }
  `;
}

type TCreateStockoutData = {
  createStockout: OneStockout;
};

export type createStockoutData = GraphQLData<TCreateStockoutData>;

export type CreateStockoutParamsData = StockoutCoreData;

interface ICreateStockoutParams {
  data: ICreateStockout;
}

export class CreateStockout extends GraphQLHttp<createStockoutData, ICreateStockoutParams> {
  public query = gql`
    mutation create($data: StockoutInput!) {
      createStockout(input: { data: $data }) {
        stockout {
          ${stockoutGraphQLString}
        }
      }
    }
  `;
}
