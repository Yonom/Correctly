import fetchPost from '../utils/fetchPost';

export const checkPlagiarism = async (data) => {
  return await fetchPost('/api/plagiarism/check', { data });
};
