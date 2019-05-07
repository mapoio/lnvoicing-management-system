import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';
import { Brand } from './brand';
import { Model } from './model';

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

export class GetGoods extends GraphQLHttp<GetGoodsData, GetGoodsParams> {
  public variables: GetGoodsParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      goods(limit: $limit) {
        id
        speedLevel
        specification
        loadIndex
        pattern
        unit
        brand {
          id
          name
          manufacturer
          created_at
          updated_at
        }
        model {
          id
          name
          created_at
          updated_at
        }
        status
        created_at
        updated_at
      }
    }
  `;
}

type TDeleteGoodData = {
  deleteGoods: OneGood;
};

export type DeleteGoodData = GraphQLData<TDeleteGoodData>;

export interface DeleteGoodParams {
  id: number;
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
  id: number;
  data: UpdateGoodParamsData;
}

export class UpdateGood extends GraphQLHttp<UpdateGoodData, IUpdateGoodParams> {
  public query = gql`
    mutation update($id: ID!, $data: editGoodsInput!) {
      updateGoods(input: { where: { id: $id }, data: $data }) {
        good {
          id
          speedLevel
          specification
          loadIndex
          pattern
          unit
          brand {
            id
            name
            manufacturer
            created_at
            updated_at
          }
          model {
            id
            name
            created_at
            updated_at
          }
          status
          created_at
          updated_at
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
          id
          speedLevel
          specification
          loadIndex
          pattern
          unit
          brand {
            id
            name
            manufacturer
            created_at
            updated_at
          }
          model {
            id
            name
            created_at
            updated_at
          }
          status
          created_at
          updated_at
        }
      }
    }
  `;
}
