import moment from 'moment';
import { deleteFrom, insertInto, selectFrom } from '../utils/sqlBuilder';
import { EFFORTS, ONE_REVIEWER, AUDIT_BY_LECTURERS, TEXTFIELD } from '../../src/utils/constants';
import Homework from './Homework';
import { addCleanupTask } from '../utils/jest.setup';

class Course {
  constructor(obj) {
    Object.assign(this, obj);
  }
}

const deleteCourse = async ({ id }) => {
  return deleteFrom('courses', 'id', id);
};

const addTestCourse = async ({
  title = 'Test Course',
  yearcode = 'ABC-123',
}) => {
  const course = await insertInto('courses', title, yearcode);

  // delete this course after tests have run
  addCleanupTask(async () => await deleteCourse(course));

  return new Course(course);
};

export default addTestCourse;
