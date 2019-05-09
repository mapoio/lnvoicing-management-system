import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';
import { Resaleitem, resaleitemGraphQLString } from './resaleitem';
import { customerGraphQLString, Customer } from './customer';

export enum resaleStatus {
  BUILDED = 'BUILDED',
  CONFIRM = 'CONFIRM',
  STOCKIN = 'STOCKIN',
  INVAILD = 'INVAILD'
}

export interface Resale extends BaseModel {
  batch: string;
  remark: string;
  money: number;
  status: resaleStatus;
  resaleitems: Resaleitem[];
  customer: Customer;
}

export interface ICreateResale {
  batch: string;
  remark: string;
  money: number;
  status: resaleStatus;
  resaleitems: any;
  customer: string;
}

export type ResaleCoreData = Pick<Resale, Exclude<keyof Resale, 'id' | 'created_at' | 'updated_at'>>;

export interface OneResale {
  resale?: Resale;
}

export interface Resales {
  resales?: Resale[];
}

export type GetResalesData = GraphQLData<Resales>;

export interface GetResalesParams {
  limit: number;
}

export const resaleCoreGraphQLString = `
id
batch
remark
money
status
created_at
updated_at
`;

export const resaleGraphQLString = `
${resaleCoreGraphQLString}
customer {
  ${customerGraphQLString}
}
resaleitems {
  ${resaleitemGraphQLString}
}
`;

export class GetResales extends GraphQLHttp<GetResalesData, GetResalesParams> {
  public variables: GetResalesParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      resales(limit: $limit, sort: "updated_at:desc") {
        ${resaleGraphQLString}
      }
    }
  `;
}

type TDeleteResaleData = {
  deleteResale: OneResale;
};

export type DeleteResaleData = GraphQLData<TDeleteResaleData>;

export interface DeleteResaleParams {
  id: string;
}

export class DeleteResale extends GraphQLHttp<DeleteResaleData, DeleteResaleParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deleteResale(input: { where: { id: $id } }) {
        resale {
          remark
        }
      }
    }
  `;
}

type TUpdateResaleData = {
  updateResale: OneResale;
};

export type UpdateResaleData = GraphQLData<TUpdateResaleData>;

export type UpdateResaleParamsData = ResaleCoreData;

interface IUpdateResaleParams {
  id: string;
  data: UpdateResaleParamsData;
}

export class UpdateResale extends GraphQLHttp<UpdateResaleData, IUpdateResaleParams> {
  public query = gql`
    mutation update($id: ID!, $data: editResaleInput!) {
      updateResale(input: { where: { id: $id }, data: $data }) {
        resale {
          ${resaleGraphQLString}
        }
      }
    }
  `;
}

type TCreateResaleData = {
  createResale: OneResale;
};

export type createResaleData = GraphQLData<TCreateResaleData>;

export type CreateResaleParamsData = ResaleCoreData;

interface ICreateResaleParams {
  data: ICreateResale;
}

export class CreateResale extends GraphQLHttp<createResaleData, ICreateResaleParams> {
  public query = gql`
    mutation create($data: ResaleInput!) {
      createResale(input: { data: $data }) {
        resale {
          ${resaleGraphQLString}
        }
      }
    }
  `;
}
