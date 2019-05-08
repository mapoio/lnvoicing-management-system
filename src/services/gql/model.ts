import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';

export interface Model extends BaseModel {
  name: string;
  remark: string;
}

export interface OneModel {
  model?: Model;
}

export interface Models {
  models?: Model[];
}

export type GetModelsData = GraphQLData<Models>;

export interface GetModelsParams {
  limit: number;
}

export const modelGraphQLString = `
id
name
remark
created_at
updated_at
`;

export class GetModels extends GraphQLHttp<GetModelsData, GetModelsParams> {
  public variables: GetModelsParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      models(limit: $limit) {
        ${modelGraphQLString}
      }
    }
  `;
}

type TDeleteModelData = {
  deleteModel: OneModel;
};

export type DeleteModelData = GraphQLData<TDeleteModelData>;

export interface DeleteModelParams {
  id: string;
}

export class DeleteModel extends GraphQLHttp<DeleteModelData, DeleteModelParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deleteModel(input: { where: { id: $id } }) {
        model {
          remark
        }
      }
    }
  `;
}

type TUpdateModelData = {
  updateModel: OneModel;
};

export type UpdateModelData = GraphQLData<TUpdateModelData>;

export type UpdateModelParamsData = Pick<Model, 'name' | 'remark'>;

interface IUpdateModelParams {
  id: string;
  data: UpdateModelParamsData;
}

export class UpdateModel extends GraphQLHttp<UpdateModelData, IUpdateModelParams> {
  public query = gql`
    mutation update($id: ID!, $data: editModelInput!) {
      updateModel(input: { where: { id: $id }, data: $data }) {
        model {
          ${modelGraphQLString}
        }
      }
    }
  `;
}

type TCreateModelData = {
  createModel: OneModel;
};

export type createModelData = GraphQLData<TCreateModelData>;

export type CreateModelParamsData = Pick<Model, 'name' | 'remark'>;

interface ICreateModelParams {
  data: CreateModelParamsData;
}

export class CreateModel extends GraphQLHttp<createModelData, ICreateModelParams> {
  public query = gql`
    mutation create($data: ModelInput!) {
      createModel(input: { data: $data }) {
        model {
          ${modelGraphQLString}
        }
      }
    }
  `;
}
