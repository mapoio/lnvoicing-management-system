import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';

export enum repertoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Repertory extends BaseModel {
  name: string;
  address: string;
  manageName: string;
  managePhone: number;
  status: repertoryStatus;
}

export type RepertoryCoreData = Pick<Repertory, Exclude<keyof Repertory, 'id' | 'created_at' | 'updated_at'>>;

export interface OneRepertory {
  repertory?: Repertory;
}

export interface Repertorys {
  repertorys?: Repertory[];
}

export type GetRepertorysData = GraphQLData<Repertorys>;

export interface GetRepertorysParams {
  limit: number;
}

export const repertoryGraphQLString = `
id
name
address
manageName
managePhone
status
created_at
updated_at
`;

export class GetRepertorys extends GraphQLHttp<GetRepertorysData, GetRepertorysParams> {
  public variables: GetRepertorysParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      repertorys: repertories(limit: $limit, sort: "updated_at:desc") {
        ${repertoryGraphQLString}
      }
    }
  `;
}

type TDeleteRepertoryData = {
  deleteRepertory: OneRepertory;
};

export type DeleteRepertoryData = GraphQLData<TDeleteRepertoryData>;

export interface DeleteRepertoryParams {
  id: string;
}

export class DeleteRepertory extends GraphQLHttp<DeleteRepertoryData, DeleteRepertoryParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deleteRepertory(input: { where: { id: $id } }) {
        repertory {
          address
        }
      }
    }
  `;
}

type TUpdateRepertoryData = {
  updateRepertory: OneRepertory;
};

export type UpdateRepertoryData = GraphQLData<TUpdateRepertoryData>;

export type UpdateRepertoryParamsData = RepertoryCoreData;

interface IUpdateRepertoryParams {
  id: string;
  data: UpdateRepertoryParamsData;
}

export class UpdateRepertory extends GraphQLHttp<UpdateRepertoryData, IUpdateRepertoryParams> {
  public query = gql`
    mutation update($id: ID!, $data: editRepertoryInput!) {
      updateRepertory(input: { where: { id: $id }, data: $data }) {
        repertory {
          ${repertoryGraphQLString}
        }
      }
    }
  `;
}

type TCreateRepertoryData = {
  createRepertory: OneRepertory;
};

export type createRepertoryData = GraphQLData<TCreateRepertoryData>;

export type CreateRepertoryParamsData = RepertoryCoreData;

interface ICreateRepertoryParams {
  data: CreateRepertoryParamsData;
}

export class CreateRepertory extends GraphQLHttp<createRepertoryData, ICreateRepertoryParams> {
  public query = gql`
    mutation create($data: RepertoryInput!) {
      createRepertory(input: { data: $data }) {
        repertory {
          ${repertoryGraphQLString}
        }
      }
    }
  `;
}
