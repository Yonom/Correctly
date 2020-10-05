import { databaseQuery } from '.';
import { SQL_FOR_PERCENTAGE_GRADE } from '../../../utils/percentageGradeConst';

// select all solutions of a homework
export const selectSolutions = async (homeworkId) => {
  const queryText = `SELECT id, userid
  FROM solutions
  WHERE homeworkid = $1`;
  const params = [homeworkId];
  return await databaseQuery(queryText, params);
};

export const selectSolutionsAndGrades = async (homeworkId) => {
  const queryText = `SELECT solutions.id, solutions.userid, AVG(percentagegrade) AS percentageGrade
  FROM solutions
  ${SQL_FOR_PERCENTAGE_GRADE}
  WHERE homeworkid = $1
  GROUP BY solutions.id`;
  const params = [homeworkId];
  return await databaseQuery(queryText, params);
};

export const selectSolution = async (homeworkId, userId) => {
  const queryText = `
    SELECT solutions.id, AVG(percentagegrade) AS percentageGrade
    FROM solutions
    ${SQL_FOR_PERCENTAGE_GRADE}
    WHERE homeworkid = $1 AND userid = $2
    GROUP BY solutions.id
  `;
  const params = [homeworkId, userId];
  return await databaseQuery(queryText, params);
};
