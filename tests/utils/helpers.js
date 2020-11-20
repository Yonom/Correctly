import fetchGet from '../../src/utils/fetchGet';
import { addTestStudent } from '../models/User';

export const runDistribution = async () => {
  return fetchGet('/api/cron/distribution');
};

export const createTestStudents = (count) => {
  return Promise.all(
    new Array(count)
      .fill(null)
      .map(async () => await addTestStudent()),
  );
};
