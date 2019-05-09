import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';

export interface Brand extends BaseModel {
  name: string;
  manufacturer: string;
  remark: string;
}

export type BrandCoreData = Pick<Brand, Exclude<keyof Brand, 'id' | 'created_at' | 'updated_at'>>;

export interface OneBrand {
  brand?: Brand;
}

export interface Brands {
  brands?: Brand[];
}

export type GetBrandsData = GraphQLData<Brands>;

export interface GetBrandsParams {
  limit: number;
}

export const brandGraphQLString = `
id
name
manufacturer
remark
created_at
updated_at
`;

export class GetBrands extends GraphQLHttp<GetBrandsData, GetBrandsParams> {
  public variables: GetBrandsParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      brands(limit: $limit, sort: "updated_at:desc") {
        ${brandGraphQLString}
      }
    }
  `;
}

type TDeleteBrandData = {
  deleteBrand: OneBrand;
};

export type DeleteBrandData = GraphQLData<TDeleteBrandData>;

export interface DeleteBrandParams {
  id: string;
}

export class DeleteBrand extends GraphQLHttp<DeleteBrandData, DeleteBrandParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deleteBrand(input: { where: { id: $id } }) {
        brand {
          remark
        }
      }
    }
  `;
}

type TUpdateBrandData = {
  updateBrand: OneBrand;
};

export type UpdateBrandData = GraphQLData<TUpdateBrandData>;

export type UpdateBrandParamsData = BrandCoreData;

interface IUpdateBrandParams {
  id: string;
  data: UpdateBrandParamsData;
}

export class UpdateBrand extends GraphQLHttp<UpdateBrandData, IUpdateBrandParams> {
  public query = gql`
    mutation update($id: ID!, $data: editBrandInput!) {
      updateBrand(input: { where: { id: $id }, data: $data }) {
        brand {
          ${brandGraphQLString}
        }
      }
    }
  `;
}

type TCreateBrandData = {
  createBrand: OneBrand;
};

export type createBrandData = GraphQLData<TCreateBrandData>;

export type CreateBrandParamsData = BrandCoreData;

interface ICreateBrandParams {
  data: CreateBrandParamsData;
}

export class CreateBrand extends GraphQLHttp<createBrandData, ICreateBrandParams> {
  public query = gql`
    mutation create($data: BrandInput!) {
      createBrand(input: { data: $data }) {
        brand {
          ${brandGraphQLString}
        }
      }
    }
  `;
}
