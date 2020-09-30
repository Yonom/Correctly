import useSWR from 'swr';

export const useMyEditableCourses = () => {
  return useSWR('/api/courses/myEditable');
};

export const useCourse = (courseId) => {
  return useSWR(`/api/courses/getCourse?courseId=${courseId}`);
};

export const useCourseAndAttendees = (courseId) => {
  return useSWR(`/api/courses/getCourseAndAttendees?courseId=${courseId}`);
};

export const useCourseHomeworks = (courseId) => {
  return useSWR(`/api/courses/getCourseHomeworks?courseId=${courseId}`);
};