import useSWR from 'swr';
import fetchPost from '../utils/fetchPost';

export const addCourse = async (title, yearCode, users) => {
  return await fetchPost('/api/courses/add', { title, yearCode, users });
};
export const editCourse = async (id, title, yearCode, users) => {
  return await fetchPost('/api/courses/edit', { id, title, yearCode, users });
};

export const useMyCourses = () => {
  return useSWR('/api/courses/my');
};

export const useMyEditableCourses = () => {
  return useSWR('/api/courses/myEditable');
};

export const useCourse = (courseId) => {
  return useSWR(`/api/courses/get?courseId=${courseId}`);
};

export const useCourseAndAttendees = (courseId) => {
  return useSWR(`/api/courses/getCourseAndAttendees?courseId=${courseId}`);
};

export const useCourseHomeworks = (courseId) => {
  return useSWR(`/api/courses/getCourseHomeworks?courseId=${courseId}`);
};
