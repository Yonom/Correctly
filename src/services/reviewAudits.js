import useSWR from 'swr';

export const useMyReviewAudits = () => {
  return useSWR('/api/reviewAudits/my');
};
