import { isStudentEmail } from '../../src/utils/auth/isStudentEmail';
import { addCleanupTask } from '../utils/jest.setup';
import { deleteFrom, insertInto } from '../utils/sqlBuilder';

const deleteUser = async ({ userid }) => {
  return deleteFrom('users', 'userid', userid);
};

const addTestUser = async ({
  userid = `TEST-${Math.random()}`,
  email,
  firstname = 'Test',
  lastname = 'User',
  studentid = 123456789,
  isemailverified = true,
  isactive = true,
  biography = null,
}) => {
  const isStudentIdRequired = isStudentEmail(email);
  const studentIdIfRequired = isStudentIdRequired ? studentid : null;
  const user = await insertInto('users', userid, email, firstname, lastname, studentIdIfRequired, isemailverified, isactive, biography);

  // delete this user after tests have run
  addCleanupTask(async () => await deleteUser(user));

  return user;
};

export const addTestStudent = async (config) => {
  return addTestUser({
    email: 'teststudent@fs-students.de',
    ...config,
  });
};

export const addTestLecturer = async (config) => {
  return addTestUser({
    email: 'testlecturer@fs.de',
    ...config,
  });
};

export const addTestSuperuser = async (config) => {
  return addTestUser({
    email: 'testsuperuser@fs.de',
    ...config,
  });
};
