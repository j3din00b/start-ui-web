import Axios from 'axios';
import {
  useMutation,
  MutationConfig,
  usePaginatedQuery,
  useQueryCache,
} from 'react-query';

export const useUserList = ({ page = 0, size = 10 } = {}) => {
  const result = usePaginatedQuery(
    ['users', { page, size }],
    (): Promise<any> => Axios.get('/users', { params: { page, size } })
  );

  const { content: users, totalItems } = result.resolvedData || {};
  const totalPages = Math.ceil(totalItems / size);
  const hasMore = page + 1 < totalPages;
  const isLoadingPage = result.isFetching && !result.latestData;

  return {
    users,
    totalItems,
    hasMore,
    totalPages,
    isLoadingPage,
    ...result,
  };
};

export const useUserUpdate = (config: MutationConfig<any> = {}) => {
  const queryCache = useQueryCache();
  return useMutation((payload: any) => Axios.put('/users', payload), {
    ...config,
    onSuccess: (data, ...rest) => {
      queryCache.cancelQueries('users');
      queryCache.getQueries('users').forEach(({ queryKey }) => {
        queryCache.setQueryData(queryKey, (cachedData: any) => {
          if (!cachedData) return;
          return {
            ...cachedData,
            content: (cachedData.content || []).map((user) =>
              user.id === data.id ? data : user
            ),
          };
        });
      });
      queryCache.invalidateQueries('users');
      if (config.onSuccess) {
        config.onSuccess(data, ...rest);
      }
    },
  });
};