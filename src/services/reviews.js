import useSWR from 'swr';

export const useMyReviews = () => {
  return useSWR('/api/reviews/my');
};
