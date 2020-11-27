import moment from 'moment';
import { AUDIT_REASON_PLAGIARISM } from '../../src/utils/constants';
import fetchGet from '../../src/utils/fetchGet';
import { addTestStudent } from '../models/User';

const runDistribution = async () => {
  return fetchGet('/api/cron/distribution');
};

export const getHasAudit = (solutionId) => {
  return fetchGet(`/api/audits/hasAudit?solutionId=${solutionId}`);
};

export const showReview = (reviewId) => {
  return fetchGet(`/api/reviews/show?reviewId=${reviewId}`);
};

export const getReview = (reviewId) => {
  return fetchGet(`/api/reviews/get?reviewId=${reviewId}`);
};

export const getSolution = (homeworkId, userId) => {
  return fetchGet(`/api/solutions/get?homeworkId=${homeworkId}&userId=${userId}`);
};

export const getCourse = async (courseId) => {
  return fetchGet(`/api/courses/get?courseId=${courseId}`);
};

export const getHomework = async (homeworkId) => {
  return fetchGet(`/api/homeworks/get?homeworkId=${homeworkId}`);
};

export const getMyCourses = async () => {
  return fetchGet('/api/courses/my');
};

export const getMyHomeworks = async () => {
  return fetchGet('/api/homeworks/my');
};

export const getMyReviews = async () => {
  return fetchGet('/api/reviews/my');
};

export const getMyAudits = async () => {
  return fetchGet('/api/audits/my');
};

export const createTestStudents = (count) => {
  return Promise.all(
    new Array(count)
      .fill(null)
      .map(async () => await addTestStudent()),
  );
};

export const runPositivePlagiarismCheck = async (homework, solutions) => {
  await homework.set({
    solutionstart: moment().subtract(1, 'minute'),
    solutionend: moment().subtract(1, 'minute'),
    reviewstart: moment().subtract(1, 'minute'),
    hasdistributedreviews: true,
  });

  const reviews = [];
  const audits = [];
  for (const solution of solutions) {
    reviews.push([
      await solution.addReview({
        userid: solution.userid,
        issystemreview: true,
        issubmitted: true,
        percentagegrade: 0,
        reviewcomment: 'plagiarism',
      }),
    ]);
    audits.push([
      await solution.addAudit({ reason: AUDIT_REASON_PLAGIARISM }),
    ]);
  }
  return [reviews, audits];
};

export const runDistributionOfReviews = async (homework, solutions = []) => {
  await homework.set({
    solutionstart: moment().subtract(1, 'minute'),
    solutionend: moment().subtract(1, 'minute'),
    reviewstart: moment().subtract(1, 'minute'),
  });

  const result = await runDistribution();
  expect(result).toStrictEqual({});

  const reviews = [];
  for (const solution of solutions) {
    reviews.push(
      await solution.getReviews(),
    );
  }

  const flattenedReviews = reviews.flat(2);
  return {
    toRecieve: reviews,
    toDo: solutions.map((s) => {
      return flattenedReviews.filter((r) => r.userid === s.userid);
    }),
  };
};

export const runDistributionOfAudits = async (homework, solutions = []) => {
  await homework.set({
    solutionstart: moment().subtract(1, 'minute'),
    solutionend: moment().subtract(1, 'minute'),
    reviewstart: moment().subtract(1, 'minute'),
    reviewend: moment().subtract(1, 'minute'),
  });

  const result = await runDistribution();
  expect(result).toStrictEqual({});

  const audits = [];
  for (const solution of solutions) {
    audits.push(
      await solution.getAudits(),
    );
  }
  return audits;
};
