import moment from 'moment';
import { isStudentEmail } from '../../src/utils/auth/isStudentEmail';
import { addCleanupTask } from '../utils/jest.setup';
import { deleteFrom, insertInto } from '../utils/sqlBuilder';

const deleteUser = async ({ userid }) => {
  return deleteFrom('users', 'userid', userid);
};

let userCount = 0;

addCleanupTask(() => {
  userCount = 0;
});

const addTestUser = async (type, {
  email,
  firstname = 'Test',
  lastname = 'User',
  studentid = 123456789,
  isemailverified = true,
  isactive = true,
  biography = null,
  creationdate = moment(),
}) => {
  userCount += 1;

  const isStudentIdRequired = isStudentEmail(email);
  const studentIdIfRequired = isStudentIdRequired ? studentid : null;
  const user = await insertInto('users', `TEST-${type}-${userCount}-${Math.random()}`, email, firstname, lastname, studentIdIfRequired, isemailverified, isactive, biography, creationdate);

  // delete this user after tests have run
  addCleanupTask(async () => await deleteUser(user));

  return user;
};

export const addTestStudent = async (config) => {
  return addTestUser('student', {
    email: 'teststudent@fs-students.de',
    ...config,
  });
};

export const addTestLecturer = async (config) => {
  return addTestUser('lecturer', {
    email: 'testlecturer@fs.de',
    ...config,
  });
};

export const addTestSuperuser = async (config) => {
  return addTestUser('superuser', {
    email: 'testsuperuser@fs.de',
    ...config,
  });
};
