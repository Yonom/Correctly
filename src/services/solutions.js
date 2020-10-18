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