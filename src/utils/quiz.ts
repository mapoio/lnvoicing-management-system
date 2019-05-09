import { hashHistory } from '@store/router';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

export interface GraphQLData<D, E = any> {
  data: D;
  error?: E;
}

export interface BaseModel {
  readonly id: string;
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

export const searchItem = <T extends any[]>(id: string, source: T) => {
  const index = source.findIndex(item => item.id === id);
  const data = source[index];
  return { index, data };
};

type searchReture = {
  [x: string]: string;
};

export const getSearch = <T extends any>(location: T): searchReture => {
  const search = location.search.split('?');
  const searchObjectStr = search[search.length - 1].split('&');
  const result = searchObjectStr
    .map(param => {
      const keyValue = param.split('=');
      return {
        [keyValue[0]]: keyValue[keyValue.length - 1]
      };
    })
    .reduce((res, key) => Object.assign(res, key), {});
  return result;
};

export const getRouterSearch = () => {
  return getSearch(hashHistory.location);
};

export const useRouterSearch = () => {
  const [search, setSearch] = useState(getRouterSearch());
  useEffect(() => {
    const unlisten = hashHistory.listen(location => setSearch(getSearch(location)));
    return unlisten;
  });
  return { search, setSearch };
};

export const formatTime = (num: number) => dayjs(num).format('YYYY-MM-DD HH:mm:ss');
