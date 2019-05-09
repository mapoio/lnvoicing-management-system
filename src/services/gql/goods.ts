import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData } from '@utils/index';

const getGoodses = gql`
  query getGoods($limit: Int) {
    goods(limit: $limit, sort: "updated_at:desc") {
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
      }
      model {
        id
        name
      }
      status
    }
  }
`;

const getModel = gql`
  query getModel($limit: Int) {
    models(limit: $limit, sort: "updated_at:desc") {
      id
      name
      remark
    }
  }
`;

const getBrand = gql`
  query getBrand($limit: Int) {
    brands(limit: $limit, sort: "updated_at:desc") {
      id
      name
      remark
      manufacturer
    }
  }
`;

export enum GoodsStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Model {
  id: string;
  name: string;
  remark: string;
}

export interface Brand {
  id: string;
  name: string;
  manufacturer: string;
  remark: string;
}

export interface IGoods {
  /**
   * 商品ID
   *
   * @type {string}
   * @memberof IGoods
   */
  id: string;
  speedLevel: string;
  specification: string;
  loadIndex: number;
  pattern: string;
  unit: string;
  status: GoodsStatus;
}

export interface IGoodsWithInfo extends IGoods {
  brand: Pick<Model, 'id' | 'name'>;
  model: Pick<Brand, 'name' | 'id' | 'manufacturer'>;
}

interface IGetGoodsList {
  goods?: IGoodsWithInfo[];
}

export type IGetGoodsData = GraphQLData<IGetGoodsList>;

interface IModelsList {
  models?: Model[];
}

export type IModelsData = GraphQLData<IModelsList>;

interface IBrandList {
  brands?: Brand[];
}

export type IBrandData = GraphQLData<IBrandList>;

export interface IParams {
  limit: number;
}

export class GetGoodses extends GraphQLHttp<IGetGoodsData, IParams> {
  public variables: IParams = {
    limit: 5
  };
  public query = getGoodses;
}

export class GetModels extends GraphQLHttp<IModelsData, IParams> {
  public variables: IParams = {
    limit: 5
  };
  public query = getModel;
}

export class GetBrand extends GraphQLHttp<IBrandData, IParams> {
  public variables: IParams = {
    limit: 5
  };
  public query = getBrand;
}
