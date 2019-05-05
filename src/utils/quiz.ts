export interface GraphQLData<D, E = any> {
  data: D;
  error?: E;
}

export interface BaseModel {
  readonly id: number;
  readonly created_at: number;
  readonly updated_at: number;
}

export const handleGraphQLError = <D extends GraphQLData<any, any>>(res: D): D => {
  if (res.error) {
    if (Array.isArray(res.error) && res.error.length > 0) {
      throw new Error(res.error[0].message);
    }
    throw new Error(res.error || 'Unknow Error!');
  }
  return res;
};
