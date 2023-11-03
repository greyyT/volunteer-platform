import { fetcher } from '@/api';
import useSWR from 'swr';

export const useEventInfo = (id: string) => {
  const { data, isLoading, error, mutate } = useSWR(`/api/event/${id}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
