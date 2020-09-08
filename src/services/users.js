import useSWR from 'swr';
import fetchPost from '../utils/fetchPost';

export const useAllUsers = () => {
  return useSWR('/api/users/allUsers');
};

export const useUser = (userId) => {
  return useSWR(`/api/users/getUser?userId=${userId}`);
};

export const setBiography = async (userId, biography) => {
  return await fetchPost('/api/users/setBiography', {
    userId,
    biography,
  });
};
