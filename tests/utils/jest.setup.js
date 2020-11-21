import { databaseEnd } from '../../src/services/api/database';
import apiMock from './apiMock';
import dbCleanup from './dbCleanup';
import { setTestCookie } from './setLogin';

const cleanupTasks = [];
export const addCleanupTask = (callback) => {
  cleanupTasks.push(callback);
};

const timeoutInterval = 30000;
jest.setTimeout(timeoutInterval);

global.beforeAll(async () => {
  apiMock();
  await dbCleanup(timeoutInterval);
});

global.afterAll(async () => {
  await databaseEnd();
});

global.beforeEach(async () => {
  setTestCookie(undefined);
});

global.afterEach(async () => {
  await Promise.all(cleanupTasks.map((c) => c()));
  cleanupTasks.length = 0;
});
