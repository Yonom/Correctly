import fetchPost from '../utils/fetchPost';

export const addSolution = async (
  homeworkId,
  solutionFile,
  solutlionFilename,
  solutionComment,
) => {
  return await fetchPost('/api/solutions/add', {
    homeworkId,
    solutionFile,
    solutlionFilename,
    solutionComment,
  });
};
