import useSWR from 'swr';
import fetchPost from '../utils/fetchPost';

export const addSolution = async (
  homeworkId,
  solutionFile,
  solutionFilename,
  solutionComment,
) => {
  return await fetchPost('/api/solutions/add', {
    homeworkId,
    solutionFile,
    solutionFilename,
    solutionComment,
  });
};

export const useSolution = (homeworkId, userId) => {
  return useSWR(homeworkId && userId ? `/api/solutions/get?homeworkId=${homeworkId}&userId=${userId}` : null);
};
