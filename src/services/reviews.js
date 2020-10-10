import useSWR from 'swr';

export const useMyReviews = () => {
  return useSWR('/api/reviews/my');
};

export const useTestReview = (id) => {
  return ({
    data: {
      id,
      issubmitted: false,
      solutionid: '594182416036003841',
      modelsolutionname: 'solution.pdf',
      homeworkid: '594182414990770177',
      homeworkname: 'First Homework Demo',
      correctingstart: '2020-08-01 00:00:00',
      correctingend: '2021-11-01 00:45:00',
      exerciseassignmentname: 'demo.pptx',
      evaluationschemename: 'test.txt',
    },
  });
};
