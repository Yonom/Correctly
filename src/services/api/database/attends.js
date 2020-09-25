import { databaseQuery } from '.';

/**
 * returns userid and isselected of all users attending course
 *
 * @param courseId id of attended course
 */
export function selectAttendees(courseId) {
  const queryText = 'SELECT userid, isstudent, islecturer, ismodulecoordinator FROM attends WHERE courseid = $1';
  const params = [courseId];
  return databaseQuery(queryText, params);
}
