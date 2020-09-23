import useSWR, { mutate } from 'swr';
import fetchPost from '../utils/fetchPost';

export const useAllUsers = () => {
  return useSWR('/api/users/allUsers');
};

const revalidateAllUsers = () => {
  return mutate('/api/users/allUsers');
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

export const deleteUser = async (userId) => {
  const res = await fetchPost('/api/users/deleteUser', { userId });
  await revalidateAllUsers();
  return res;
};

export const changeUser = async (userId, firstName, lastName, email, studentId) => {
  const res = await fetchPost('/api/users/changeUser', { userId, firstName, lastName, email, studentId });
  await revalidateAllUsers();
  return res;
};

export const GetCoursesOfUser = (userId) => {
  return useSWR(`/api/users/getCourses?userId=${userId}`);
};

export const GetHomeworksOfUser = (userId) => {
  return useSWR(`/api/users/getHomeworks?userId=${userId}`);
};

export const GetReviewsOfUser = (userId) => {
  return useSWR(`/api/users/getReviews?userId=${userId}`);
};
