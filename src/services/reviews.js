import { mutate } from 'swr';
import { useLoadingSWR } from '../components/GlobalNotifications';
import fetchPost from '../utils/fetchPost';

export const useMyReviews = () => {
  return useLoadingSWR('/api/reviews/my');
};

export const useReview = (reviewId) => {
  return useLoadingSWR(reviewId ? `/api/reviews/get?reviewId=${reviewId}` : null);
};

export const addLecturerReview = async (solutionId) => {
  return fetchPost(solutionId ? `/api/reviews/add?solutionId=${solutionId}` : null);
};

export const useReviewToShow = (reviewId) => {
  return useLoadingSWR(reviewId ? `/api/reviews/show?reviewId=${reviewId}` : null);
};

export const changeReview = async (reviewId, percentageGrade, reviewFiles, reviewFileNames, reviewComment) => {
  const res = await fetchPost('/api/reviews/edit', {
    reviewId,
    percentageGrade,
    reviewFiles,
    reviewFileNames,
    reviewComment,
  });
  mutate('/api/reviews/my');
  return res;
};
