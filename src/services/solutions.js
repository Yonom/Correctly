import { mutate } from 'swr';
import { useLoadingSWR } from '../components/GlobalNotifications';
import fetchPost from '../utils/fetchPost';

export const addSolution = async (
  homeworkId,
  solutionFile,
  solutionFilename,
  solutionComment,
) => {
  const res = await fetchPost('/api/solutions/add', {
    homeworkId,
    solutionFile,
    solutionFilename,
    solutionComment,
  });
  mutate('/api/homeworks/my');
  return res;
};

export const useSolution = (homeworkId, userId) => {
  return useLoadingSWR(homeworkId && userId ? `/api/solutions/get?homeworkId=${homeworkId}&userId=${userId}` : null);
};
