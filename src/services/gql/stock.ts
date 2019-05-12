import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';
import { Good, goodGraphQLString } from './good';
import { Repertory, repertoryGraphQLString } from './repertory';
import { Purchaseitem, purchaseitemCoreGraphQLString } from './purchaseitem';
import { Saleitem, saleitemCoreGraphQLString } from './saleitem';
import { Resaleitem, resaleitemCoreGraphQLString } from './resaleitem';

export enum stockStatus {
  STOCKIN = 'STOCKIN',
  STOCKOUT = 'STOCKOUT',
  DAMAGE = 'DAMAGE'
}

export interface Stock extends BaseModel {
  goodsCode: string;
  status: stockStatus;
  goods: Good;
  repertory: Repertory;
  purchaseitem: Purchaseitem;
  resaleitem: Resaleitem;
  saleitem: Saleitem;
}

export interface ICreateStock {
  goodsCode: string;
  status: stockStatus;
  goods: string;
  repertory: string;
  purchaseitem: string;
  resaleitem: string;
  saleitem: string;
}

export type StockCoreData = Pick<Stock, Exclude<keyof Stock, 'id' | 'created_at' | 'updated_at'>>;

export interface OneStock {
  stock?: Stock;
}

export interface Stocks {
  stocks?: Stock[];
}

export type GetStocksData = GraphQLData<Stocks>;

export interface GetStocksParams {
  limit: number;
}

export const stockCoreGraphQLString = `
id
goodsCode
status
created_at
updated_at
`;

export const stockGraphQLString = `
${stockCoreGraphQLString}
goods {
  ${goodGraphQLString}
}
repertory {
  ${repertoryGraphQLString}
}
purchaseitem {
  ${purchaseitemCoreGraphQLString}
}
saleitem {
  ${saleitemCoreGraphQLString}
}
resaleitem {
  ${resaleitemCoreGraphQLString}
}
`;

export class GetStocks extends GraphQLHttp<GetStocksData, GetStocksParams> {
  public variables: GetStocksParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      stocks(limit: $limit, sort: "updated_at:desc") {
        ${stockGraphQLString}
      }
    }
  `;
}

type TDeleteStockData = {
  deleteStock: OneStock;
};

export type DeleteStockData = GraphQLData<TDeleteStockData>;

export interface DeleteStockParams {
  id: string;
}

export class DeleteStock extends GraphQLHttp<DeleteStockData, DeleteStockParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deleteStock(input: { where: { id: $id } }) {
        stock {
          remark
        }
      }
    }
  `;
}

type TUpdateStockData = {
  updateStock: OneStock;
};

export type UpdateStockData = GraphQLData<TUpdateStockData>;

export type UpdateStockParamsData = StockCoreData;

interface IUpdateStockParams {
  id: string;
  data: Pick<ICreateStock, Exclude<keyof ICreateStock, 'goodsCode'>>;
}

export class UpdateStock extends GraphQLHttp<UpdateStockData, IUpdateStockParams> {
  public query = gql`
    mutation update($id: ID!, $data: editStockInput!) {
      updateStock(input: { where: { id: $id }, data: $data }) {
        stock {
          ${stockGraphQLString}
        }
      }
    }
  `;
}

type TCreateStockData = {
  createStock: OneStock;
};

export type createStockData = GraphQLData<TCreateStockData>;

export type CreateStockParamsData = StockCoreData;

interface ICreateStockParams {
  data: ICreateStock;
}

export class CreateStock extends GraphQLHttp<createStockData, ICreateStockParams> {
  public query = gql`
    mutation create($data: StockInput!) {
      createStock(input: { data: $data }) {
        stock {
          ${stockGraphQLString}
        }
      }
    }
  `;
}
