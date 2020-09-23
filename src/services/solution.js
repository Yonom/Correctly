import useSWR from 'swr';

export const GetSolution = (userId, homeworkId) => {
  return useSWR(`/api/users/getSolution?userId=${userId}&homeworkId=${homeworkId}`);
};
