export interface GraphQLData<D, E = any> {
  data: D;
  error?: E;
}
