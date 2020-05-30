import { TokenExpiredError } from 'jsonwebtoken';
import { databaseReturnQuery, databaseQuery, databaseTransaction } from '.';

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
  const queryText = 'INSERT INTO attends(userid, courseid, isstudent, islecturer, ismodulecoordinator) VALUES($1, $2, $3, $4, $5)';
  let count = 0;
  try {
    for (const user of users) {
      // double exclamation marks convert undefined role selections to false
      const params = [user.userid, courseId, !!user.selectedStudent, !!user.selectedLecturer, !!user.selectedModuleCoordinator];
      console.log(params);
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


export const createNewCourse = (courseTitle, yearCode, users) => {
  return databaseTransaction(async (client) => {
    const queryTextInsertCourse = 'INSERT INTO courses(title, yearCode) VALUES($1, $2) RETURNING id';
    const paramsInsertCourse = [courseTitle, yearCode];
    const res = await client.query(queryTextInsertCourse, paramsInsertCourse);
    const courseId = res.rows[0].id;
    console.log('course created with courseid =', courseId);

    const queryTextInsertUsers = 'INSERT INTO attends(userid, courseid, isstudent, islecturer, ismodulecoordinator) VALUES($1, $2, $3, $4, $5)';
    let count = 0;
    let res2;
    for (const user of users) {
      // double exclamation marks convert undefined role selections to false
      const params = [user.id, courseId, !!user.selectedStudent, !!user.selectedLecturer, !!user.selectedModuleCoordinator];
      console.log(params);
      // client.query(queryTextInsertUsers, params)
      //   .then((res) => console.log(4, 'result', res))
      //   .catch((e) => { throw new Error(); });
      res2 = client.query(queryTextInsertUsers, params);
      count += 1;
    }
    console.log('course created successfully');
    return count;
  // client.databaseQuery(queryText1, params);
  });
};
