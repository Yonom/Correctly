import useSWR from 'swr';
import fetchPost from '../utils/fetchPost';

export const useMyReviews = () => {
  return useSWR('/api/reviews/my');
};

export const useReview = (reviewId) => {
  return useSWR(reviewId ? `/api/reviews/get?reviewId=${reviewId}` : null);
};

export const addLecturerReview = async (solutionId) => {
  return fetchPost(solutionId ? `/api/reviews/add?solutionId=${solutionId}` : null);
};

export const changeReview = async (reviewId, percentageGrade, reviewFiles, reviewFileNames, reviewComment) => {
  const res = await fetchPost('/api/reviews/edit', {
    reviewId,
    percentageGrade,
    reviewFiles,
    reviewFileNames,
    reviewComment,
  });
  return res;
};
