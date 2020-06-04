import { databaseQuery, databaseTransaction } from '.';

/**
 * creates a single new course without any attendees
 *
 * @param {string} courseTitle the title of the course
 * @param {string} yearCode the code for the year e.g. 'WI/DIF172'
 * @returns {string} courseId the unique course Identifier
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
 * @returns {number} num of how many attendees have been created
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
 *
 * @returns {object[]} all courses that exist in the database
 */
export const selectAllCourses = async () => {
  const queryText = 'SELECT * FROM courses;';
  const params = [];
  const res = await databaseQuery(queryText, params);
  return res.rows;
};

/**
 * creates a single new course as a transaction including attendees.
 *
 * @param {string} courseTitle the title of the course
 * @param {string} yearCode the code for the year e.g. 'WI/DIF172'
 * @param {object[]} users Array of user-objects with .userid and .role properties
 * (e.g. '.selectedLecturer' or '.selectedStudent'), id referring to Table.Users.userid
 * @returns {string} courseId the unique course Identifier
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
