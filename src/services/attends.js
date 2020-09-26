import useSWR from 'swr';

export const useAttends = (courseId) => {
  return useSWR(`/api/attends/getAttendees?courseId=${courseId}`);
};
