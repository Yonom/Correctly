import { useLoadingSWR } from '../components/GlobalNotifications';
import fetchPost from '../utils/fetchPost';

export const useMyAudits = () => {
  return useLoadingSWR('/api/audits/my');
};

export const useHasAudit = (solutionId) => {
  return useLoadingSWR(solutionId ? `/api/audits/hasAudit?solutionId=${solutionId}` : null);
};

export const resolveAudit = async (solutionId) => {
  return fetchPost(`/api/audits/resolve?solutionId=${solutionId}`);
};
