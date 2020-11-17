import useSWR from 'swr';
import fetchPost from '../utils/fetchPost';

export const useMyAudits = () => {
  return useSWR('/api/audits/my');
};

export const useHasAudit = (solutionId) => {
  return useSWR(`/api/audits/hasAudit?solutionId=${solutionId}`);
};

export const resolveAudit = async (solutionId) => {
  return fetchPost(solutionId ? `/api/audits/resolve?solutionId=${solutionId}` : null);
};
