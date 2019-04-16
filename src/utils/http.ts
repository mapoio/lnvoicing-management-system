import axios, { AxiosRequestConfig } from 'axios';
import { DocumentNode } from 'graphql';

const Axios = axios.create({
  baseURL: 'http://localhost:8083',
  timeout: 1000
});

export interface ISendOptions {
  operationName?: any;
  context?: any;
  extensions?: any;
}

export class GraphQLHttp<HttpData extends any = {}, Variables extends any = {}> {
  static HTTP = Axios;

  public http = Axios;
  public query: DocumentNode;
  public url = '/graphql';
  public variables: Partial<Variables>;

  static create = (config: AxiosRequestConfig = {}, url: string = '/graphql') => {
    const http = axios.create(config);
    const GraphQLRequest = class extends GraphQLHttp {
      public http = http;
      static create = () => {
        throw new Error('Can`t create new instance in instance');
      };
    };
    return GraphQLRequest;
  };

  public async send(variable?: Partial<Variables>, options?: ISendOptions) {
    const query = this.query.loc.source.body;
    const { operationName, context, extensions } = options || {
      operationName: undefined,
      context: undefined,
      extensions: undefined
    };
    const variables = Object.assign({ ...this.variables }, { ...variable });
    const body = {
      query,
      variables,
      operationName,
      context,
      extensions
    };
    const res = await this.http.post<HttpData>(this.url, body);
    return res.data;
  }
}
