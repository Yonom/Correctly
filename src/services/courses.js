import { useLoadingSWR } from '../components/GlobalNotifications';
import fetchGet from '../utils/fetchGet';
import fetchPost from '../utils/fetchPost';

export const addCourse = async (title, yearCode, users) => {
  return await fetchPost('/api/courses/add', { title, yearCode, users });
};
export const editCourse = async (id, title, yearCode, users) => {
  return await fetchPost('/api/courses/edit', { id, title, yearCode, users });
};

export const useMyCourses = () => {
  return useLoadingSWR('/api/courses/my');
};

export const useMyEditableCourses = () => {
  return useLoadingSWR('/api/courses/myEditable');
};

export const useCourse = (courseId) => {
  return useLoadingSWR(courseId ? `/api/courses/get?courseId=${courseId}` : null);
};

export const getCourseCSV = (courseId) => {
  return fetchGet(`/api/courses/getCSV?courseId=${courseId}`);
};

export const useCourseCSV = (courseId) => {
  return useSWR(courseId ? `/api/courses/getCSV?courseId=${courseId}` : null);
};
