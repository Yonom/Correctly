import { databaseEnd } from '../../src/services/api/database';
import apiMock from './apiMock';

global.beforeAll(async () => {
  apiMock();
});

global.afterAll(async () => {
  await databaseEnd();
});
