import useSWR from 'swr';

export const useMyEditableCourses = () => {
  return useSWR('/api/courses/myEditable');
};

export const useUsers = () => {
  return useSWR('/api/courses/getUsers')
};
