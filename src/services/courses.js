import useSWR from 'swr';

export const useMyEditableCourses = () => {
  return useSWR('/api/courses/myEditable');
};

export const useCourse = (courseId) => {
  return useSWR(`/api/courses/${courseId}`);
};
