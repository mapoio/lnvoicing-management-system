import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';

export enum customerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum customerType {
  VIP = 'VIP',
  SVIP = 'SVIP',
  NORMAL = 'NORMAL'
}

export interface Customer extends BaseModel {
  name: string;
  phone: number;
  address: string;
  manageName: string;
  managePhone: number;
  type: customerType;
  status: customerStatus;
}

export type CustomerCoreData = Pick<Customer, Exclude<keyof Customer, 'id' | 'created_at' | 'updated_at'>>;

export interface OneCustomer {
  customer?: Customer;
}

export interface Customers {
  customers?: Customer[];
}

export type GetCustomersData = GraphQLData<Customers>;

export interface GetCustomersParams {
  limit: number;
}

export class GetCustomers extends GraphQLHttp<GetCustomersData, GetCustomersParams> {
  public variables: GetCustomersParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      customers(limit: $limit, sort: "updated_at:desc") {
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
      }
    }
  `;
}

type TDeleteCustomerData = {
  deleteCustomer: OneCustomer;
};

export type DeleteCustomerData = GraphQLData<TDeleteCustomerData>;

export interface DeleteCustomerParams {
  id: string;
}

export class DeleteCustomer extends GraphQLHttp<DeleteCustomerData, DeleteCustomerParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deleteCustomer(input: { where: { id: $id } }) {
        customer {
          address
        }
      }
    }
  `;
}

type TUpdateCustomerData = {
  updateCustomer: OneCustomer;
};

export type UpdateCustomerData = GraphQLData<TUpdateCustomerData>;

export type UpdateCustomerParamsData = CustomerCoreData;

interface IUpdateCustomerParams {
  id: string;
  data: UpdateCustomerParamsData;
}

export class UpdateCustomer extends GraphQLHttp<UpdateCustomerData, IUpdateCustomerParams> {
  public query = gql`
    mutation update($id: ID!, $data: editCustomerInput!) {
      updateCustomer(input: { where: { id: $id }, data: $data }) {
        customer {
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
        }
      }
    }
  `;
}

type TCreateCustomerData = {
  createCustomer: OneCustomer;
};

export type createCustomerData = GraphQLData<TCreateCustomerData>;

export type CreateCustomerParamsData = CustomerCoreData;

interface ICreateCustomerParams {
  data: CreateCustomerParamsData;
}

export class CreateCustomer extends GraphQLHttp<createCustomerData, ICreateCustomerParams> {
  public query = gql`
    mutation create($data: CustomerInput!) {
      createCustomer(input: { data: $data }) {
        customer {
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
        }
      }
    }
  `;
}
