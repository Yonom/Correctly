import useSWR from 'swr';

export const useMyEditableCourses = () => {
  return useSWR('/api/courses/myEditable');
};
