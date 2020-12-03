import moment from 'moment';
import { addCourse } from '../../src/services/courses';
import { AUDIT_REASON_PLAGIARISM } from '../../src/utils/constants';
import fetchGet from '../../src/utils/fetchGet';
import Course, { deleteCourse } from '../models/Course';
import { addTestStudent } from '../models/User';
import { addCleanupTask } from './jest.setup';
import { selectFrom } from './sqlBuilder';
import { fetchFileDownload } from './apiMock';

export const addTestCourseViaAPI = async (title, users) => {
  const course = await addCourse(title, `TEST-${Math.random()}`, users);

  // delete this course after tests have run
  addCleanupTask(async () => await deleteCourse(course));

  const courseObjs = await selectFrom('courses', 'id', course.id);
  return new Course(courseObjs[0]);
};

export const runDistribution = async () => {
  return fetchGet('/api/cron/distribution');
};

export const getHealth = () => {
  return fetchGet('/api/health');
};

export const getPostman = () => {
  return fetchGet('/api/postman');
};

export const getAllUsers = () => {
  return fetchGet('/api/users/all');
};

export const getUser = (userid) => {
  return fetchGet(`/api/users/get?userId=${userid}`);
};

export const getHasAudit = (solutionId) => {
  return fetchGet(`/api/audits/has?solutionId=${solutionId}`);
};

export const getAudit = (solutionId) => {
  return fetchGet(`/api/audits/get?solutionId=${solutionId}`);
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

export const getMyEditableCourses = async () => {
  return fetchGet('/api/courses/myEditable');
};

export const getMyHomeworks = async () => {
  return fetchGet('/api/homeworks/my');
};

export const getMyEditableHomeworks = async () => {
  return fetchGet('/api/homeworks/myEditable');
};

export const getMyReviews = async () => {
  return fetchGet('/api/reviews/my');
};

export const getMyAudits = async () => {
  return fetchGet('/api/audits/my');
};

export const downloadHomeworkTask = (homeworkId) => {
  return fetchFileDownload(`/api/homeworks/downloadTask?homeworkId=${homeworkId}`);
};

export const downloadHomeworkEvaluationScheme = (homeworkId) => {
  return fetchFileDownload(`/api/homeworks/downloadEvaluationScheme?homeworkId=${homeworkId}`);
};

export const downloadHomeworkSampleSolution = (homeworkId) => {
  return fetchFileDownload(`/api/homeworks/downloadSampleSolution?homeworkId=${homeworkId}`);
};

export const downloadSolution = (solutionId) => {
  return fetchFileDownload(`/api/solutions/downloadSolution?solutionId=${solutionId}`);
};

export const downloadReview = (reviewId) => {
  return fetchFileDownload(`/api/reviews/downloadReview?reviewId=${reviewId}`);
};

export const addTestStudents = (count) => {
  return Promise.all(
    new Array(count)
      .fill(null)
      .map(async () => await addTestStudent()),
  );
};

export const createMockFiles = (count) => {
  return Promise.all(
    new Array(count)
      .fill(null)
      .map(async (_, i) => await addTestStudent({ userid: `TEST-${i + 1}-${Math.random()}` })),
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
    solutionstart: moment().subtract(1, 'hour'),
    solutionend: moment().subtract(1, 'hour'),
    reviewstart: moment().subtract(1, 'hour'),
  });

  const result = await runDistribution();
  expect(result).toStrictEqual({});

  await homework.refresh();
  expect(homework.hasdistributedreviews).toBe(true);

  const reviews = [];
  for (const solution of solutions) {
    reviews.push(
      await solution.getReviews(),
    );
  }

  const flattenedReviews = reviews.flat(2);
  return {
    toReceive: reviews,
    toDo: solutions.map((s) => {
      return flattenedReviews.filter((r) => r.userid === s.userid);
    }),
  };
};

export const runDistributionOfAudits = async (homework, solutions = []) => {
  await homework.set({
    solutionstart: moment().subtract(1, 'hour'),
    solutionend: moment().subtract(1, 'hour'),
    reviewstart: moment().subtract(1, 'hour'),
    reviewend: moment().subtract(1, 'hour'),
  });

  const result = await runDistribution();
  expect(result).toStrictEqual({});

  await homework.refresh();
  expect(homework.hasdistributedaudits).toBe(true);

  const audits = [];
  for (const solution of solutions) {
    audits.push(
      await solution.getAudits(),
    );
  }
  return audits;
};
