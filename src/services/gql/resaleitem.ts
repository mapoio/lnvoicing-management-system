import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';
import { Good, goodGraphQLString } from './good';

export enum resaleitemStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Resaleitem extends BaseModel {
  price: number;
  amount: number;
  status: resaleitemStatus;
  good: Good;
  stocks: Stock[] | string[];
}

export interface ICreateResaleitem {
  price: number;
  amount: number;
  status: resaleitemStatus;
  good: string;
  resale: string;
}

export type ResaleitemCoreData = Pick<Resaleitem, Exclude<keyof Resaleitem, 'id' | 'created_at' | 'updated_at'>>;

export interface OneResaleitem {
  resaleitem?: Resaleitem;
}

export interface Resaleitems {
  resaleitems?: Resaleitem[];
}

export type GetResaleitemsData = GraphQLData<Resaleitems>;

export interface GetResaleitemsParams {
  limit: number;
}

export const resaleitemCoreGraphQLString = `
id
price
amount
status
created_at
updated_at
`;

export const resaleitemGraphQLString = `
${resaleitemCoreGraphQLString}
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

export class GetResaleitems extends GraphQLHttp<GetResaleitemsData, GetResaleitemsParams> {
  public variables: GetResaleitemsParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      resaleitems(limit: $limit, sort: "updated_at:desc") {
        ${resaleitemGraphQLString}
      }
    }
  `;
}

type TDeleteResaleitemData = {
  deleteResaleitem: OneResaleitem;
};

export type DeleteResaleitemData = GraphQLData<TDeleteResaleitemData>;

export interface DeleteResaleitemParams {
  id: string;
}

export class DeleteResaleitem extends GraphQLHttp<DeleteResaleitemData, DeleteResaleitemParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deleteResaleitem(input: { where: { id: $id } }) {
        resaleitem {
          address
        }
      }
    }
  `;
}

type TUpdateResaleitemData = {
  updateResaleitem: OneResaleitem;
};

export type UpdateResaleitemData = GraphQLData<TUpdateResaleitemData>;

export type UpdateResaleitemParamsData = ResaleitemCoreData;

interface IUpdateResaleitemParams {
  id: string;
  data: UpdateResaleitemParamsData;
}

export class UpdateResaleitem extends GraphQLHttp<UpdateResaleitemData, IUpdateResaleitemParams> {
  public query = gql`
    mutation update($id: ID!, $data: editResaleitemInput!) {
      updateResaleitem(input: { where: { id: $id }, data: $data }) {
        resaleitem {
          ${resaleitemGraphQLString}
        }
      }
    }
  `;
}

type TCreateResaleitemData = {
  createResaleitem: OneResaleitem;
};

export type createResaleitemData = GraphQLData<TCreateResaleitemData>;

export type CreateResaleitemParamsData = ResaleitemCoreData;

interface ICreateResaleitemParams {
  data: ICreateResaleitem;
}

export class CreateResaleitem extends GraphQLHttp<createResaleitemData, ICreateResaleitemParams> {
  public query = gql`
    mutation create($data: ResaleitemInput!) {
      createResaleitem(input: { data: $data }) {
        resaleitem {
          ${resaleitemGraphQLString}
        }
      }
    }
  `;
}
