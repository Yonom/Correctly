import { setBiography } from '../../src/services/users';
import setLogin from '../utils/setLogin';
import { addTestLecturer, addTestStudent, addTestSuperuser } from '../models/User';

describe('biography', () => {
  test('sets own biography', async () => {
    const user = await addTestStudent();
    await setLogin(user);

    const result = await setBiography(user.userid, 'Hello world');

    expect(result).toStrictEqual({});
    await user.refresh();
    expect(user.biography).toBe('Hello world');
  });

  test('superuser can set the biography of student', async () => {
    const student = await addTestStudent();
    const superuser = await addTestSuperuser();
    await setLogin(superuser);

    const result = await setBiography(student.userid, 'Hello world');

    expect(result).toStrictEqual({});
    await student.refresh();
    expect(student.biography).toBe('Hello world');
  });

  test('lecturer cannot set the biography of student', async () => {
    const student = await addTestStudent();
    const lecturer = await addTestLecturer();
    await setLogin(lecturer);

    await expect(async () => {
      await setBiography(student.userid, 'Hello world');
    }).rejects.toStrictEqual({ code: 'auth/unauthorized' });
  });
});
