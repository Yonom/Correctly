import useSWR from 'swr';

// get all open reviews for a certain homework
export const GetReviews = (homeworkId) => {
  return useSWR(`/api/users/getReviews?homeworkId=${homeworkId}`);
};
