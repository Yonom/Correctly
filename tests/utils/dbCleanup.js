import { databaseQuery } from '../../src/services/api/database';

const dbCleanup = async (timeoutInterval) => {
  const maxAge = `${timeoutInterval + 60000} milliseconds`;
  await databaseQuery(`
    DELETE FROM users
    WHERE left(users.userid, 5) = 'TEST-'
    AND age(users.creationdate) > $1
  `, [maxAge]);
  await databaseQuery(`
    DELETE FROM courses
    WHERE left(courses.yearcode, 5) = 'TEST-'
    AND age(courses.creationdate) > $1
  `, [maxAge]);
};

export default dbCleanup;
