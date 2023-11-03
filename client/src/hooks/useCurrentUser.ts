import fetcher from '@/api/fetcher';
import useSWRImmutable from 'swr/immutable';
import { z } from 'zod';

const accountSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
  username: z.string(),
  phone: z.string(),
  location: z.string().nullable(),
  portrait: z.string().nullable(),
  isVerified: z.boolean(),
  isOrganization: z.boolean(),
});

const useCurrentUser = () => {
  const { data, isLoading, error, mutate } = useSWRImmutable('/api/account', fetcher);

  return {
    data: data ? accountSchema.parse(data?.data) : undefined,
    error,
    isLoading,
    mutate,
  };
};

export default useCurrentUser;
