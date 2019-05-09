import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';
import { Brand, brandGraphQLString } from './brand';
import { Model, modelGraphQLString } from './model';

export enum goodStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Good extends BaseModel {
  specification: string;
  loadIndex: number;
  speedLevel: string;
  pattern: string;
  unit: string;
  status: goodStatus;
  brand: Brand;
  model: Model;
}

export type GoodCoreData = Pick<Good, Exclude<keyof Good, 'id' | 'created_at' | 'updated_at'>>;

export interface OneGood {
  good?: Good;
}

export interface Goods {
  goods?: Good[];
}

export type GetGoodsData = GraphQLData<Goods>;

export interface GetGoodsParams {
  limit: number;
}

export const goodCoreGraphQLString = `
id
speedLevel
specification
loadIndex
pattern
unit
status
created_at
updated_at
`;

export const goodGraphQLString = `
${goodCoreGraphQLString}
brand {
  ${brandGraphQLString}
}
model {
  ${modelGraphQLString}
}
`;

export class GetGoods extends GraphQLHttp<GetGoodsData, GetGoodsParams> {
  public variables: GetGoodsParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      goods(limit: $limit, sort: "updated_at:desc") {
        ${goodGraphQLString}
      }
    }
  `;
}

type TDeleteGoodData = {
  deleteGoods: OneGood;
};

export type DeleteGoodData = GraphQLData<TDeleteGoodData>;

export interface DeleteGoodParams {
  id: string;
}

export class DeleteGood extends GraphQLHttp<DeleteGoodData, DeleteGoodParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deleteGoods(input: { where: { id: $id } }) {
        good {
          unit
        }
      }
    }
  `;
}

type TUpdateGoodData = {
  updateGoods: OneGood;
};

export type UpdateGoodData = GraphQLData<TUpdateGoodData>;

export type UpdateGoodParamsData = GoodCoreData;

interface IUpdateGoodParams {
  id: string;
  data: UpdateGoodParamsData;
}

export class UpdateGood extends GraphQLHttp<UpdateGoodData, IUpdateGoodParams> {
  public query = gql`
    mutation update($id: ID!, $data: editGoodsInput!) {
      updateGoods(input: { where: { id: $id }, data: $data }) {
        good {
          ${goodGraphQLString}
        }
      }
    }
  `;
}

type TCreateGoodData = {
  createGoods: OneGood;
};

export type createGoodData = GraphQLData<TCreateGoodData>;

export type CreateGoodParamsData = GoodCoreData;

interface ICreateGoodParams {
  data: CreateGoodParamsData;
}

export class CreateGood extends GraphQLHttp<createGoodData, ICreateGoodParams> {
  public query = gql`
    mutation create($data: GoodsInput!) {
      createGoods(input: { data: $data }) {
        good {
          ${goodGraphQLString}
        }
      }
    }
  `;
}
