import moment from 'moment';
import { AUDIT_REASON_PLAGIARISM } from '../../src/utils/constants';
import fetchGet from '../../src/utils/fetchGet';
import { addTestStudent } from '../models/User';

const runDistribution = async () => {
  return fetchGet('/api/cron/distribution');
};

export const createTestStudents = (count) => {
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

export const runDistributionOfReviews = async (homework, solutions) => {
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
  return reviews;
};

export const runDistributionOfAudits = async (homework, solutions) => {
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
