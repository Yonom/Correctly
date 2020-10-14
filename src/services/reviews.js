import useSWR from 'swr';
import fetchPost from '../utils/fetchPost';

export const useMyReviews = () => {
  return useSWR('/api/reviews/my');
};

export const useReview = (reviewId) => {
  return useSWR(reviewId && `/api/reviews/get?reviewId=${reviewId}`);
};

export const useTestReview = (id) => {
  return ({
    data: {
      id,
      issubmitted: false,
      solutionid: '594182416036003841',
      modelsolutionname: 'model_solution.pdf',
      homeworkid: '594182414990770177',
      homeworkname: 'First Homework Demo',
      correctingstart: '2020-08-01 00:00:00',
      correctingend: '2021-11-01 00:45:00',
      exerciseassignmentname: 'demo.pptx',
      evaluationschemename: 'test.txt',
      solutionfilename: 'solution.pdf',
      solutioncomment: 'Dies ist meine Lösung',
      evaluationvariant: 'zeroToOnehundred',
      correctionallowedformats: ['textfield', 'pdf'],
    },
  });
};

export const changeReview = async (reviewId, percentageGrade, documentationFile, documentationFileName, documentationComment) => {
  const res = await fetchPost('api/reviews/edit', {
    reviewId,
    percentageGrade,
    documentationFile,
    documentationFileName,
    documentationComment,
  });
  return res;
};
