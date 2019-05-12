import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';
import { User, userGraphQLString } from './user';

export enum EmployeeRole {
  STOCK = 'STOCK',
  USER = 'USER',
  SALE = 'SALE',
  RESALE = 'RESALE',
  PURCHASE = 'PURCHASE',
  ADMIN = 'ADMIN'
}

export enum employeeType {
  INTERN = 'INTERN',
  REGULAI = 'REGULAI',
  OUTWORKER = 'OUTWORKER'
}

export interface Employee extends BaseModel {
  name: string;
  phone: number;
  position: string;
  type: employeeType;
  role: EmployeeRole;
  user: User;
}

interface CreateOrUpdate {
  name: string;
  phone: number;
  position: string;
  type: employeeType;
  role: EmployeeRole;
  user: string;
}

export type EmployeeCoreData = Pick<Employee, Exclude<keyof Employee, 'id' | 'created_at' | 'updated_at'>>;

export interface OneEmployee {
  employee?: Employee;
}

export interface Employees {
  employees?: Employee[];
}

export type GetEmployeesData = GraphQLData<Employees>;

export interface GetEmployeesParams {
  limit: number;
}

export const employeeGraphQLString = `
id
name
phone
position
role
type
user {
  ${userGraphQLString}
}
created_at
updated_at
`;

export class GetEmployees extends GraphQLHttp<GetEmployeesData, GetEmployeesParams> {
  public variables: GetEmployeesParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      employees(limit: $limit, sort: "updated_at:desc") {
        ${employeeGraphQLString}
      }
    }
  `;
}

type TDeleteEmployeeData = {
  deleteEmployee: OneEmployee;
};

export type DeleteEmployeeData = GraphQLData<TDeleteEmployeeData>;

export interface DeleteEmployeeParams {
  id: string;
}

export class DeleteEmployee extends GraphQLHttp<DeleteEmployeeData, DeleteEmployeeParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deleteEmployee(input: { where: { id: $id } }) {
        employee {
          phone
        }
      }
    }
  `;
}

type TUpdateEmployeeData = {
  updateEmployee: OneEmployee;
};

export type UpdateEmployeeData = GraphQLData<TUpdateEmployeeData>;

export type UpdateEmployeeParamsData = EmployeeCoreData;

interface IUpdateEmployeeParams {
  id: string;
  data: CreateOrUpdate;
}

export class UpdateEmployee extends GraphQLHttp<UpdateEmployeeData, IUpdateEmployeeParams> {
  public query = gql`
    mutation update($id: ID!, $data: editEmployeeInput!) {
      updateEmployee(input: { where: { id: $id }, data: $data }) {
        employee {
          ${employeeGraphQLString}
        }
      }
    }
  `;
}

type TCreateEmployeeData = {
  createEmployee: OneEmployee;
};

export type createEmployeeData = GraphQLData<TCreateEmployeeData>;

export type CreateEmployeeParamsData = EmployeeCoreData;

interface ICreateEmployeeParams {
  data: CreateOrUpdate;
}

export class CreateEmployee extends GraphQLHttp<createEmployeeData, ICreateEmployeeParams> {
  public query = gql`
    mutation create($data: EmployeeInput!) {
      createEmployee(input: { data: $data }) {
        employee {
          ${employeeGraphQLString}
        }
      }
    }
  `;
}
