import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';
import { GraphQLData, BaseModel } from '@utils/index';

export enum UserRole {
  STOCK = 'STOCK',
  USER = 'USER',
  SALE = 'SALE',
  RESALE = 'RESALE',
  PURCHASE = 'PURCHASE',
  ADMIN = 'ADMIN'
}

export enum userType {
  INTERN = 'INTERN',
  REGULAI = 'REGULAI',
  OUTWORKER = 'OUTWORKER'
}

export interface User {
  id: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  role: string;
}

export type UserCoreData = User;

export interface OneUser {
  user?: User;
}

export interface Users {
  users?: User[];
}

export type GetUsersData = GraphQLData<Users>;

export interface GetUsersParams {
  limit: number;
}

export const userGraphQLString = `
id
username
email
provider
confirmed
blocked
`;

export class GetUsers extends GraphQLHttp<GetUsersData, GetUsersParams> {
  public variables: GetUsersParams = {
    limit: 10
  };
  public query = gql`
    query get($limit: Int) {
      users(limit: $limit, sort: "updated_at:desc") {
        ${userGraphQLString}
      }
    }
  `;
}

type TDeleteUserData = {
  deleteUser: OneUser;
};

export type DeleteUserData = GraphQLData<TDeleteUserData>;

export interface DeleteUserParams {
  id: string;
}

export class DeleteUser extends GraphQLHttp<DeleteUserData, DeleteUserParams> {
  public query = gql`
    mutation delete($id: ID!) {
      deleteUser(input: { where: { id: $id } }) {
        user {
          provider
        }
      }
    }
  `;
}

type TUpdateUserData = {
  updateUser: OneUser;
};

export type UpdateUserData = GraphQLData<TUpdateUserData>;

export type UpdateUserParamsData = UserCoreData;

interface IUpdateUserParams {
  id: string;
  data: UpdateUserParamsData;
}

export class UpdateUser extends GraphQLHttp<UpdateUserData, IUpdateUserParams> {
  public query = gql`
    mutation update($id: ID!, $data: editUserInput!) {
      updateUser(input: { where: { id: $id }, data: $data }) {
        user {
          ${userGraphQLString}
        }
      }
    }
  `;
}

type TCreateUserData = {
  createUser: OneUser;
};

export type createUserData = GraphQLData<TCreateUserData>;

export type CreateUserParamsData = UserCoreData;

interface ICreateUserParams {
  data: CreateUserParamsData;
}

export class CreateUser extends GraphQLHttp<createUserData, ICreateUserParams> {
  public query = gql`
    mutation create($data: UserInput!) {
      createUser(input: { data: $data }) {
        user {
          ${userGraphQLString}
        }
      }
    }
  `;
}
