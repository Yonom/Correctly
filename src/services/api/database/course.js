import { databaseReturnQuery } from '.';

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

// TODO: implement
export const addUsersToCourse = async (courseId, users) => {
  return null;
};

export const selectAllCourses = async () => {
  const queryText = 'SELECT * FROM courses;';
  const params = [];
  const result = await databaseReturnQuery(queryText, params);
  return result;
};
