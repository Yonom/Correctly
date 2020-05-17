import { databaseQuery } from '.';

/**
 * @param courseTitle
 * @param yearCode
 * @param persons
 */
export function addCourse(courseTitle, yearCode, persons) {
  const queryText = 'INSERT INTO courses(title, yearCode) VALUES($1, $2) RETURNING id';
  const params = [courseTitle, yearCode];
  const userId = databaseQuery(queryText, params);
  if (persons.length !== 0) {

  }
}
