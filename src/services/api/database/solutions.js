import { databaseQuery } from '.';

// select solution based on userId and homeworkId
export const selectSolution = async (userId, homeworkId) => {
  const queryText = 'SELECT * FROM solutions WHERE userid = $1 AND homeworkid = $2';
  const params = [userId, homeworkId];
  return await databaseQuery(queryText, params);
};
