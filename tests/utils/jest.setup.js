import { databaseEnd } from '../../src/services/api/database';

global.afterAll(async () => {
  await databaseEnd();
});
