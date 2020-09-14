import useSWR from 'swr';

export const useMyCourses = () => {
  return useSWR('/api/courses/my');
};
