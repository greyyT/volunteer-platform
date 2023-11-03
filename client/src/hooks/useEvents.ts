import { fetcher } from '@/api';
import useSWR from 'swr';

const useEvents = () => {
  const { data, isLoading, error, mutate } = useSWR('api/event', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};

export default useEvents;
