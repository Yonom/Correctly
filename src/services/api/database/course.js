import format from 'pg-format';
import { databaseQuery, databaseTransaction } from '.';

/**
 * creates a single new course as a transaction including attendees.
 *
 * @param {string} courseTitle the title of the course
 * @param {string} yearCode the code for the year e.g. 'WI/DIF172'
 * @param {object[]} users Array of user-objects with .userid and .role properties
 * (e.g. '.selectedLecturer' or '.selectedStudent'), id referring to Table.Users.userid
 * @returns {Promise<string>} the unique course Identifier
 */
export const createNewCourse = (courseTitle, yearCode, users) => {
  return databaseTransaction(async (client) => {
    // first of all, create a new course
    const queryTextInsertCourse = 'INSERT INTO courses(title, yearCode) VALUES($1, $2) RETURNING id';
    const paramsInsertCourse = [courseTitle, yearCode];
    const res = await client.query(queryTextInsertCourse, paramsInsertCourse);
    const courseId = res.rows[0].id;

    // afterwards, loop through the users and insert them as attendees
    // for the formerly created course
    const queryTextInsertUsers = 'INSERT INTO attends(userid, courseid, isstudent, islecturer, ismodulecoordinator) VALUES %L';
    const values = users.map((user) => [user.userid, courseId, !!user.selectedStudent, !!user.selectedLecturer, !!user.selectedModuleCoordinator]);
    const queryFinal = format(queryTextInsertUsers, values);
    await client.query(queryFinal);

    return courseId;
  });
};

/**
 * updates an existing course as a transaction.
 *
 * @param {string} courseId the course that shoudl be updated
 * @param {string} courseTitle the new title of the course
 * @param {string} yearCode the new code for the year e.g. 'WI/DIF172'
 * @param {object[]} users Array of user-objects with .userid and .role properties
 * (e.g. '.selectedLecturer' or '.selectedStudent'), id referring to Table.Users.userid
 * @returns {Promise<boolean>} true if transaction succeeded
 */
export const updateCourse = (courseId, courseTitle, yearCode, users) => {
  return databaseTransaction(async (client) => {
    // delete the old attendees
    const queryTextDeleteAttendees = 'DELETE FROM attends WHERE courseid = $1';
    const paramsDeleteAttendees = [courseId];
    await client.query(queryTextDeleteAttendees, paramsDeleteAttendees);

    // afterwards, loop through the users and insert them as new attendees
    // for the course
    const queryTextInsertUsers = 'INSERT INTO attends(userid, courseid, isstudent, islecturer, ismodulecoordinator) VALUES %L';
    const values = users.map((user) => [user.userid, courseId, !!user.selectedStudent, !!user.selectedLecturer, !!user.selectedModuleCoordinator]);
    const queryFinal = format(queryTextInsertUsers, values);
    await client.query(queryFinal);

    // Update the cooursetitle and yearcode
    const queryTextUpdateCourseMeta = 'UPDATE courses SET (title, yearcode) = ($1, $2) WHERE id = $3';
    const paramsUpdateCourseMeta = [courseTitle, yearCode, courseId];
    await client.query(queryTextUpdateCourseMeta, paramsUpdateCourseMeta);

    return true;
  });
};

export const selectEditableCoursesForUser = (userId, isSuperuser) => {
  const queryText = `
    SELECT * FROM courses WHERE id IN (
      SELECT courseid FROM attends 
      INNER JOIN users ON users.userid = attends.userid  
      WHERE users.userid = $1
      AND isactive AND isemailverified
      AND (islecturer OR ismodulecoordinator)
    ) OR $2
  `;
  const params = [userId, isSuperuser];
  return databaseQuery(queryText, params);
};

/**
 * Returns data of a single course with the relevant courses.Id
 *
 * @param {number} courseId Id of a course referring to Table.courses.id
 * @param {string} userId
 * @param {boolean} isSuperuser
 */
export function selectCourseForUser(courseId, userId, isSuperuser) {
  const queryText = `SELECT * FROM courses WHERE id = $1 AND id IN (
    SELECT courseid FROM attends
    INNER JOIN users ON users.userid = attends.userid 
    WHERE users.userid = $2 
    AND isactive AND isemailverified 
    AND (islecturer OR ismodulecoordinator OR isstudent OR $3)
  )`;
  const params = [courseId, userId, isSuperuser];
  return databaseQuery(queryText, params);
}
