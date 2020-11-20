import { databaseEnd } from '../../src/services/api/database';
import apiMock from './apiMock';

const cleanupTasks = [];
export const addCleanupTask = (callback) => {
  cleanupTasks.push(callback);
};

jest.setTimeout(30000);

global.beforeAll(async () => {
  apiMock();
});

global.afterAll(async () => {
  await Promise.all(cleanupTasks.map((c) => c()));
  await databaseEnd();
});
