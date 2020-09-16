import useSWR from 'swr';

export const GetSolution = (userId, homeworkId) => {
  return useSWR(`/api/users/getHomework?userId=${userId}&homeworkId=${homeworkId}`);
};
