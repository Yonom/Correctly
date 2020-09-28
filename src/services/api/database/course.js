import { databaseQuery, databaseTransaction } from '.';

/**
 * creates a single new course without any attendees
 *
 * @param {string} courseTitle the title of the course
 * @param {string} yearCode the code for the year e.g. 'WI/DIF172'
 */
export const addCourse = async (courseTitle, yearCode) => {
  const queryText = 'INSERT INTO courses(title, yearCode) VALUES($1, $2) RETURNING id';
  const params = [courseTitle, yearCode];
  let courseId = 0;
  const res = await databaseQuery(queryText, params);
  courseId = res.rows[0].id;
  return courseId;
};

/**
 * adds users to an existing course.
 *
 * @param {string} courseId  Id of a course referring to Table.courses.id
 * @param {object[]} users Array of user-objects with .userid and .role properties
 * (e.g. '.selectedLecturer' or '.selectedStudent'), id referring to Table.Users.userid
 */
export const addUsersToCourse = async (courseId, users) => {
  return databaseTransaction(async (client) => {
    const queryText = 'INSERT INTO attends(userid, courseid, isstudent, islecturer, ismodulecoordinator) VALUES($1, $2, $3, $4, $5)';
    for (const user of users) {
      // double exclamation marks convert undefined role selections to false
      const params = [user.userid, courseId, !!user.selectedStudent, !!user.selectedLecturer, !!user.selectedModuleCoordinator];
      // await databaseQuery to catch errors
      await client.query(queryText, params);
    }
    return users.length;
  });
};

/**
 * returns all courses.
 */
export const selectAllCourses = async () => {
  const queryText = 'SELECT * FROM courses;';
  const params = [];
  return await databaseQuery(queryText, params);
};

/**
 * returns a course by Id.
 *
 * @param courseId
 */
export const selectCourse = async (courseId) => {
  const queryText = 'SELECT * FROM courses Where Id = $1;';
  const params = [courseId];
  return await databaseQuery(queryText, params);
};

/**
 * returns a course by Id including all attendees.
 *
 * @param courseId
 */
export const selectCourseWithAttendees = async (courseId) => {
  const queryText = 'SELECT courseid, title, yearcode, users.userid, users.firstname, users.lastname, ismodulecoordinator, islecturer, isstudent '
  + 'FROM courses INNER JOIN attends ON courses.id = attends.courseid INNER JOIN users ON users.userid = attends.userid WHERE courses.id = $1';
  const params = [courseId];
  return await databaseQuery(queryText, params);
};

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
    const queryTextInsertUsers = 'INSERT INTO attends(userid, courseid, isstudent, islecturer, ismodulecoordinator) VALUES($1, $2, $3, $4, $5)';
    for (const user of users) {
      // double exclamation marks convert undefined role selections to false
      const params = [user.userid, courseId, !!user.selectedStudent, !!user.selectedLecturer, !!user.selectedModuleCoordinator];
      await client.query(queryTextInsertUsers, params);
    }
    return courseId;
  });
};

export const selectEditableCoursesForUser = (userId) => {
  const queryText = `SELECT * FROM courses WHERE id IN (
    SELECT courseid FROM attends 
    WHERE userid = $1 AND (islecturer OR ismodulecoordinator)
  )`;
  const params = [userId];
  return databaseQuery(queryText, params);
};

export const canViewCourse = async (userId, courseId) => {
  const queryText = `SELECT * FROM attends WHERE userid = $1 AND courseId = $2 AND
    (islecturer OR ismodulecoordinator Or isstudent)`;
  const params = [userId, courseId];
  return await databaseQuery(queryText, params);
};
