import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';
import { Repertory, repertoryGraphQLString } from './repertory';
import { Purchase, purchaseGraphQLString } from './purchase';
import { Resale, resaleGraphQLString } from './resale';

export enum stockinStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Stockin extends BaseModel {
  batch: string;
  remark: string;
  status: stockinStatus;
  repertory: Repertory;
  purchases: Purchase[];
  resales: Resale[];
}

export interface ICreateStockin {
  batch: string;
  remark: string;
  status: stockinStatus;
  repertory: string;
  purchases: string[];
  resales: string[];
}

export type StockinCoreData = Pick<Stockin, Exclude<keyof Stockin, 'id' | 'created_at' | 'updated_at'>>;

export interface OneStockin {
  stockin?: Stockin;
}

export interface Stockins {
  stockins?: Stockin[];
}

export type GetStockinsData = GraphQLData<Stockins>;

export interface GetStockinsParams {
  limit: number;
}

export const stockinCoreGraphQLString = `
id
batch
remark
status
created_at
updated_at
`;

export const stockinGraphQLString = `
${stockinCoreGraphQLString}
repertory {
  ${repertoryGraphQLString}
}
purchases {
  ${purchaseGraphQLString}
}
resales {
  ${resaleGraphQLString}
}
`;

export class GetStockins extends GraphQLHttp<GetStockinsData, GetStockinsParams> {
  public variables: GetStockinsParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      stockins(limit: $limit, sort: "updated_at:desc") {
        ${stockinGraphQLString}
      }
    }
  `;
}

type TDeleteStockinData = {
  deleteStockin: OneStockin;
};

export type DeleteStockinData = GraphQLData<TDeleteStockinData>;

export interface DeleteStockinParams {
  id: string;
}

export class DeleteStockin extends GraphQLHttp<DeleteStockinData, DeleteStockinParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deleteStockin(input: { where: { id: $id } }) {
        stockin {
          remark
        }
      }
    }
  `;
}

type TUpdateStockinData = {
  updateStockin: OneStockin;
};

export type UpdateStockinData = GraphQLData<TUpdateStockinData>;

export type UpdateStockinParamsData = StockinCoreData;

interface IUpdateStockinParams {
  id: string;
  data: UpdateStockinParamsData;
}

export class UpdateStockin extends GraphQLHttp<UpdateStockinData, IUpdateStockinParams> {
  public query = gql`
    mutation update($id: ID!, $data: editStockinInput!) {
      updateStockin(input: { where: { id: $id }, data: $data }) {
        stockin {
          ${stockinGraphQLString}
        }
      }
    }
  `;
}

type TCreateStockinData = {
  createStockin: OneStockin;
};

export type createStockinData = GraphQLData<TCreateStockinData>;

export type CreateStockinParamsData = StockinCoreData;

interface ICreateStockinParams {
  data: ICreateStockin;
}

export class CreateStockin extends GraphQLHttp<createStockinData, ICreateStockinParams> {
  public query = gql`
    mutation create($data: StockinInput!) {
      createStockin(input: { data: $data }) {
        stockin {
          ${stockinGraphQLString}
        }
      }
    }
  `;
}
