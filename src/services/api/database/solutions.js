import { databaseQuery } from '.';
import { SQL_FOR_PERCENTAGE_GRADE } from '../../../utils/constants';

// select all solutions of a homework
export const selectSolutions = async (homeworkId) => {
  const queryText = `SELECT id, userid
  FROM solutions
  WHERE homeworkid = $1`;
  const params = [homeworkId];
  return await databaseQuery(queryText, params);
};

export const selectSolutionsAndGrades = async (homeworkId) => {
  const queryText = `SELECT users.firstname, users.lastname,  solutions.id, solutions.userid, AVG(percentagegrade) AS percentageGrade
  FROM solutions
  ${SQL_FOR_PERCENTAGE_GRADE}
  JOIN users ON users.userid = solutions.userid
  WHERE homeworkid = $1
  GROUP BY solutions.id, users.*`;
  const params = [homeworkId];
  return await databaseQuery(queryText, params);
};

export const selectSolutionFileForUser = async (solutionId, userId, isSuperuser) => {
  const queryText = `
    SELECT solutions.solutionfiles, solutions.solutionfilenames
    FROM solutions
    JOIN homeworks ON homeworks.id = solutions.homeworkid
    LEFT JOIN attends ON (
      attends.courseid = homeworks.courseid AND 
      (attends.islecturer OR attends.ismodulecoordinator) AND 
      attends.userid = $2
    )
    LEFT JOIN users ON users.userid = $2
    LEFT JOIN reviews ON reviews.solutionid = solutions.id AND reviews.userid = $2
    WHERE solutions.id = $1 
    AND users.isactive AND users.isemailverified
    AND (
      (reviews.userid = $2 AND NOT reviews.issubmitted) OR
      solutions.userid = $2 OR
      attends.userid = $2 OR
      $3
    )
  `;
  const params = [solutionId, userId, isSuperuser];
  return await databaseQuery(queryText, params);
};

export const selectSolutionForUser = async (solutionId, userId, isSuperuser) => {
  const queryText = `
    SELECT solutions.id, solutions.solutionfilenames, AVG(percentagegrade) AS percentageGrade
    FROM solutions
    ${SQL_FOR_PERCENTAGE_GRADE}
    JOIN homeworks ON homeworks.id = solutions.homeworkid
    LEFT JOIN attends ON (
      attends.courseid = homeworks.courseid AND 
      (attends.islecturer OR attends.ismodulecoordinator) AND 
      attends.userid = $2
    )
    LEFT JOIN users ON users.userid = $2
    WHERE solutions.id = $1 
    AND users.isactive AND users.isemailverified
    AND (
      $3 OR
      solutions.userid = $2 OR
      attends.userid = $2
    )
    GROUP BY solutions.id
  `;
  const params = [solutionId, userId, isSuperuser];
  return await databaseQuery(queryText, params);
};

export const selectUsersWithoutSolution = async (homeworkId) => {
  const queryText = `
    SELECT attends.userid, firstname, lastname
    FROM attends
    JOIN users ON users.userid = attends.userid
    JOIN courses on attends.courseid = courses.id
    JOIN homeworks on homeworks.courseid = courses.id
    WHERE homeworks.id = $1 AND attends.isstudent AND (
      SELECT COUNT(*)
      FROM solutions
      WHERE solutions.userid = attends.userid AND solutions.homeworkid = $1
    ) = 0
  `;
  const params = [homeworkId];
  return await databaseQuery(queryText, params);
};

export const selectHomeworkSolutionAllowedFormatsForSolutionAndUser = async (homeworkId, userId) => {
  const queryText = `
    SELECT homeworks.solutionallowedformats
    FROM attends
    JOIN users ON users.userid = attends.userid
    JOIN courses on attends.courseid = courses.id
    JOIN homeworks on homeworks.courseid = courses.id
    WHERE homeworks.id = $1 
    AND attends.userid = $2 
    AND attends.isstudent 
    AND users.isactive AND users.isemailverified
    AND homeworks.solutionstart <= NOW()
    AND homeworks.solutionend > NOW()
    AND (
      SELECT COUNT(*)
      FROM solutions
      WHERE solutions.userid = $2 AND solutions.homeworkid = $1
    ) = 0
  `;
  const params = [homeworkId, userId];
  const res = await databaseQuery(queryText, params);
  if (res.rows.length === 0) return null;
  return res.rows[0].solutionallowedformats;
};

export const insertSolution = async (userId, homeworkId, solutionFile, solutionFilename, solutionComment) => {
  const queryText = `
    INSERT INTO solutions(userid, homeworkid, solutionfiles, solutionfilenames, submitdate, solutioncomment)
    VALUES($1, $2, $3, $4, Now(), $5)`;
  const params = [userId, homeworkId, [solutionFile], [solutionFilename], solutionComment];
  return await databaseQuery(queryText, params);
};
