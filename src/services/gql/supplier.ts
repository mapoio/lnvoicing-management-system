import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';

export enum supplierStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum supplierType {
  HIGH = 'HIGH',
  MIDDLE = 'MIDDLE',
  LOW = 'LOW'
}

export interface Supplier extends BaseModel {
  name: string;
  phone: number;
  address: string;
  manageName: string;
  managePhone: number;
  type: supplierType;
  status: supplierStatus;
}

export type SupplierCoreData = Pick<Supplier, Exclude<keyof Supplier, 'id' | 'created_at' | 'updated_at'>>;

export interface OneSupplier {
  supplier?: Supplier;
}

export interface Suppliers {
  suppliers?: Supplier[];
}

export type GetSuppliersData = GraphQLData<Suppliers>;

export interface GetSuppliersParams {
  limit: number;
}

export const supplierGraphQLString = `
id
name
phone
address
manageName
managePhone
type
status
created_at
updated_at
`;

export class GetSuppliers extends GraphQLHttp<GetSuppliersData, GetSuppliersParams> {
  public variables: GetSuppliersParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      suppliers(limit: $limit, sort: "updated_at:desc") {
        ${supplierGraphQLString}
      }
    }
  `;
}

type TDeleteSupplierData = {
  deleteSupplier: OneSupplier;
};

export type DeleteSupplierData = GraphQLData<TDeleteSupplierData>;

export interface DeleteSupplierParams {
  id: string;
}

export class DeleteSupplier extends GraphQLHttp<DeleteSupplierData, DeleteSupplierParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deleteSupplier(input: { where: { id: $id } }) {
        supplier {
          address
        }
      }
    }
  `;
}

type TUpdateSupplierData = {
  updateSupplier: OneSupplier;
};

export type UpdateSupplierData = GraphQLData<TUpdateSupplierData>;

export type UpdateSupplierParamsData = SupplierCoreData;

interface IUpdateSupplierParams {
  id: string;
  data: UpdateSupplierParamsData;
}

export class UpdateSupplier extends GraphQLHttp<UpdateSupplierData, IUpdateSupplierParams> {
  public query = gql`
    mutation update($id: ID!, $data: editSupplierInput!) {
      updateSupplier(input: { where: { id: $id }, data: $data }) {
        supplier {
          ${supplierGraphQLString}
        }
      }
    }
  `;
}

type TCreateSupplierData = {
  createSupplier: OneSupplier;
};

export type createSupplierData = GraphQLData<TCreateSupplierData>;

export type CreateSupplierParamsData = SupplierCoreData;

interface ICreateSupplierParams {
  data: CreateSupplierParamsData;
}

export class CreateSupplier extends GraphQLHttp<createSupplierData, ICreateSupplierParams> {
  public query = gql`
    mutation create($data: SupplierInput!) {
      createSupplier(input: { data: $data }) {
        supplier {
          ${supplierGraphQLString}
        }
      }
    }
  `;
}
