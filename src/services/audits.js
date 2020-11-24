import useSWR from 'swr';
import fetchPost from '../utils/fetchPost';

export const useMyAudits = () => {
  return useSWR('/api/audits/my');
};

export const useHasAudit = (solutionId) => {
  return useSWR(solutionId ? `/api/audits/hasAudit?solutionId=${solutionId}` : null);
};

export const resolveAudit = async (solutionId) => {
  return fetchPost(`/api/audits/resolve?solutionId=${solutionId}`);
};
