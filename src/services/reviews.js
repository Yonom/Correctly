import useSWR from 'swr';
import fetchPost from '../utils/fetchPost';

export const useMyReviews = () => {
  return useSWR('/api/reviews/my');
};

export const useReview = (reviewId) => {
  return useSWR(reviewId && `/api/reviews/get?reviewId=${reviewId}`);
};

export const changeReview = async (reviewId, percentageGrade, documentationFile, documentationFileName, documentationComment) => {
  const res = await fetchPost('/api/reviews/edit', {
    reviewId,
    percentageGrade,
    documentationFile,
    documentationFileName,
    documentationComment,
  });
  return res;
};
