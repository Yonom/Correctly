import { databaseQuery } from '.';

// select solution based on userId and homeworkId
export const selectSolution = async (userId, homeworkId) => {
  const queryText = 'SELECT * FROM solutions WHERE userid = $1 AND homeworkid = $2';
  const params = [userId, homeworkId];
  return await databaseQuery(queryText, params);
};

// select all solutions of a homework
export const selectSolutions = async (homeworkId) => {
  const queryText = `SELECT id, userid
  FROM soltuions
  WHERE homeworkid = $1`;
  const params = [homeworkId];
  return await databaseQuery(queryText, params);
};
