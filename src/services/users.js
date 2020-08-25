import useSWR from 'swr';

export const useAllUsers = () => {
  return useSWR('/api/users/allUsers');
};
