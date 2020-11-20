import { setBiography } from '../../src/services/users';
import setLogin from '../utils/setLogin';
import { addTestLecturer, addTestStudent, addTestSuperuser } from '../models/User';

describe('biography', () => {
  test('sets the biography correctly', async () => {
    const user = await addTestStudent();
    await setLogin(user);

    await setBiography(user.userid, 'Hello world');

    await user.refresh();
    expect(user.biography).toBe('Hello world');
  });

  test('superuser can set the biography of student', async () => {
    const student = await addTestStudent();
    const superuser = await addTestSuperuser();
    await setLogin(superuser);

    await setBiography(student.userid, 'Hello world');

    await student.refresh();
    expect(student.biography).toBe('Hello world');
  });

  test('lecturer can not set the biography of student', async () => {
    const student = await addTestStudent();
    const lecturer = await addTestLecturer();
    await setLogin(lecturer);

    expect(async () => {
      await setBiography(student.userid, 'Hello world');
    }).rejects.toEqual({ code: 'auth/unauthorized' });
  });
});
