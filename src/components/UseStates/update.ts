import { useState } from 'react';

export const useCreateOrUpdateState = <T>(props: T) => {
  const [data, setData] = useState(props);
  const [loading, setLoading] = useState(false);

  return { data, setData, loading, setLoading };
};
