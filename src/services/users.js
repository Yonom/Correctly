import useSWR from 'swr';

export const useAllUsers = () => {
  return useSWR('/api/users/allUsers');
};

export const useUser = (userId) => {
  return useSWR(`/api/users/getUser?userId=${userId}`);
};
