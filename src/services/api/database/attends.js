import { databaseQuery } from '.';
import { SQL_FOR_PERCENTAGE_GRADE } from '../../../utils/percentageGradeConst';

/**
 * returns userid and the roles of all active users attending course
 *
 * @param {number} courseId id of attended course
 */
export function selectAttendees(courseId) {
  const queryText = `
    SELECT users.userid, isstudent, islecturer, ismodulecoordinator, firstname, lastname
    FROM attends
    INNER JOIN users ON users.userid = attends.userid
    WHERE courseid = $1
    AND isactive AND isemailverified
    AND (isstudent OR islecturer OR ismodulecoordinator)`;
  const params = [courseId];
  return databaseQuery(queryText, params);
}

/**
 * returns userid and the roles of all active users attending course
 *
 * @param {number} courseId id of attended course
 */
export function selectAttendeesAndGrades(courseId) {
  const queryText = `
    SELECT userid, isstudent, islecturer, ismodulecoordinator, firstname, lastname, SUM(percentagegrade * cast(maxreachablepoints AS FLOAT) / 100) AS points
    FROM (
      SELECT attends.*, firstname, lastname, maxreachablepoints, AVG(percentagegrade) AS percentageGrade
      FROM attends
      INNER JOIN users ON users.userid = attends.userid
      left join homeworks on homeworks.courseid = $1
      LEFT JOIN solutions on solutions.homeworkid = homeworks.id and solutions.userid = users.userid
      ${SQL_FOR_PERCENTAGE_GRADE}
      WHERE courseid = $1
      AND isactive AND isemailverified
      AND (isstudent OR islecturer OR ismodulecoordinator)
      GROUP BY users.*, attends.*, homeworks.*, solutions.*
    )
    GROUP BY userid, isstudent, islecturer, ismodulecoordinator, firstname, lastname
  `;
  const params = [courseId];
  return databaseQuery(queryText, params);
}
