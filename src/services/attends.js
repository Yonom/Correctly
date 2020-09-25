import useSWR from 'swr';

export const useAttends = (courseId) => {
  return useSWR(`/api/courses/getAttendees?courseId=${courseId}`);
};
