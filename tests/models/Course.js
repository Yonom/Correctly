import moment from 'moment';
import { deleteFrom, insertInto, selectFrom } from '../utils/sqlBuilder';
import { EFFORTS, ONE_REVIEWER, AUDIT_BY_LECTURERS, TEXTFIELD } from '../../src/utils/constants';
import Homework from './Homework';

class Course {
  constructor(obj) {
    Object.assign(this, obj);
  }
}

const addTestCourse = async ({
  title = 'Test Course',
  yearcode = 'ABC-123',
}) => {
  return new Course(
    await insertInto('courses', title, yearcode),
  );
};
