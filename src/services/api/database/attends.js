import { databaseQuery } from '.';

/**
 * returns userid and the roles of all active users attending course
 *
 * @param courseId id of attended course
 */
export function selectAttendees(courseId) {
  const queryText = 'SELECT userid, isstudent, islecturer, ismodulecoordinator FROM attends WHERE courseid = $1 AND (select isactive From users where attends.userid = users.userid)';
  const params = [courseId];
  return databaseQuery(queryText, params);
}
