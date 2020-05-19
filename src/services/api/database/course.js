import { databaseReturnQuery, databaseQuery } from '.';

/**
 * @param courseTitle
 * @param yearCode
 * @param persons
 */
export const addCourse = async (courseTitle, yearCode) => {
  const queryText = 'INSERT INTO courses(title, yearCode) VALUES($1, $2) RETURNING id';
  const params = [courseTitle, yearCode];
  let courseId = 0;
  const res = await databaseReturnQuery(queryText, params);
  courseId = res.rows[0].id;
  return courseId;
};

/**
 * 
 * @param courseId  Id of a course referring to Table.courses.id
 * @param users Array of user-objects with .id and .role properties, id referring to Table.Users.userid
 * @returns counter of how many attendees have been created
 */
export const addUsersToCourse = async (courseId, users) => {
  const queryText = 'INSERT INTO attends(userid, courseid, attendeerole) VALUES($1, $2, $3)';
  let count = 0;
  try {
    for (const user of users) {
      const params = [user.id, courseId, user.role];
      databaseQuery(queryText, params);
      count += 1;
    }
    return count;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const selectAllCourses = async () => {
  const queryText = 'SELECT * FROM courses;';
  const params = [];
  const result = await databaseReturnQuery(queryText, params);
  return result;
};
