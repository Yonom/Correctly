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
    AND isactive
    AND (isstudent OR islecturer OR ismodulecoordinator)`;
  const params = [courseId];
  return databaseQuery(queryText, params);
}

/**
 * returns userid and the roles of all active users attending course,
 * if given userId is modulecoordinator or lecturer of given course
 *
 * @param {number} courseId
 * @param {string} userId
 */
export function selectAttendeesForUser(courseId, userId) {
  const queryText = `SELECT userid, isstudent, islecturer, ismodulecoordinator, firstname, lastname FROM attends Where courseid = $1 AND courseid IN (
    SELECT courseid FROM attends 
    INNER JOIN users ON users.userid = attends.userid 
    WHERE userid = $2 AND (islecturer OR ismodulecoordinator)
  )`;
  const params = [courseId, userId];
  return databaseQuery(queryText, params);
}
