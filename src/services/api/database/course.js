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

export const selectUsersInCourse = (courseId) => {
  const queryText = `SELECT userid FROM users
    JOIN attends ON users.userid = attends.userid
    JOIN courses ON attends.courseid = courses.id
    JOIN homeworks ON courses.id = homeworks.courseid
    JOIN solutions ON users.userid = solutions.userid
    WHERE courseId = $1 AND
    solutions.id IS NOT NULL
    homeworks.correctingstart <= NOW()`;
  const params = [courseId];
  return databaseQuery(queryText, params);
}