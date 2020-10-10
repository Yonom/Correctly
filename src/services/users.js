import useSWR, { mutate } from 'swr';
import fetchPost from '../utils/fetchPost';

export const useAllUsers = () => {
  return useSWR('/api/users/all');
};

const revalidateAllUsers = () => {
  return mutate('/api/users/all');
};

export const useUser = (userId) => {
  return useSWR(userId && `/api/users/get?userId=${userId}`);
};

export const setBiography = async (userId, biography) => {
  return await fetchPost('/api/users/setBiography', {
    userId,
    biography,
  });
};

export const deleteUser = async (userId) => {
  const res = await fetchPost('/api/users/delete', { userId });
  await revalidateAllUsers();
  return res;
};

export const changeUser = async (userId, firstName, lastName, email, studentId) => {
  const res = await fetchPost('/api/users/change', { userId, firstName, lastName, email, studentId });
  await revalidateAllUsers();
  return res;
};
