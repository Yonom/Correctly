import useSWR from 'swr';

export const useMyAudits = () => {
  return useSWR('/api/audits/my');
};
