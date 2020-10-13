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

export const selectUsersWithoutSolution = async (homeworkId, courseId) => {
  const queryText = `
    SELECT attends.userid
    FROM attends
    WHERE attends.courseid = $2 AND attends.isstudent
    AND (
      SELECT COUNT(*)
      FROM solutions
      WHERE solutions.userid = attends.userid AND solutions.homeworkid = $1
    ) = 0
  `;
  const params = [homeworkId, courseId];
  return await databaseQuery(queryText, params);
};

export const insertSolution = async (userId, homeworkId, solutionFile, solutionFilename, solutionComment) => {
  const queryText = `
    INSERT INTO solutions(userid, homeworkid, solutionfile, solutionfilename, submitdate, solutioncomment)
    VALUES($1, $2, $3, $4, Now(), $5)`;
  const params = [userId, homeworkId, solutionFile, solutionFilename, solutionComment];
  return await databaseQuery(queryText, params);
};
