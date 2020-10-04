import { databaseQuery } from '.';

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
