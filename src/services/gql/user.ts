import gql from 'graphql-tag';
import { GraphQLHttp } from '@utils/http';

const getUser = gql`
  query GETUSER($limit: Int) {
    users(limit: $limit) {
      id
      email
    }
  }
`;

export enum UserType {
  ACM = 'ACM',
  EXTEND = 'EXTEND',
  LDAP = 'LDAP'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PEDDING = 'PEDDING',
  PAUSE = 'PAUSE'
}

export interface IUser {
  id: string;
  userName: string;
  nickName: string;
  realName: string;
  email: string;
  phone: string;
  academy: string;
  className: string;
  studentNumber: string;
  type: UserType;
  status: string;
  version: number;
}

export interface IGetUserData {
  data: {
    users?: IUser[];
  };
}

interface IParams {
  limit: number;
}

// const Test = GraphQLHttp.create();

export class GetUser extends GraphQLHttp<IGetUserData, IParams> {
  public variables: IParams = {
    limit: 5
  };
  public query = getUser;
}
