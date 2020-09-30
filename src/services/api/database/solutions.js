import { databaseQuery } from '.';

// select all solutions of a homework
export const selectSolutions = async (homeworkId) => {
  const queryText = `SELECT id, userid
  FROM soltuions
  WHERE homeworkid = $1`;
  const params = [homeworkId];
  return await databaseQuery(queryText, params);
};
