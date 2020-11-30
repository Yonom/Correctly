import { changeUser, deleteUser } from '../../src/services/users';
import { LECTURER } from '../../src/utils/auth/role';
import { addTestLecturer, addTestSuperuser } from '../models/User';
import { getAllUsers, getUser } from '../utils/helpers';
import setLogin from '../utils/setLogin';

describe('manage users', () => {
  test('can get all users', async () => {
    const lecturer = await addTestLecturer();
    await setLogin(lecturer);
    const allUsers = await getAllUsers();
    const myUser = allUsers.filter((u) => u.userid === lecturer.userid)[0];
    expect(myUser.userid).toBe(lecturer.userid);

    const user = await getUser(myUser.userid);
    expect(user.role).toBe(LECTURER);
  });

  test('can change user', async () => {
    const superuser = await addTestSuperuser();
    await setLogin(superuser);
    const changeResult = await changeUser(
      superuser.userid,
      'TestTest',
      'TestTestTest',
      'test@fs.de',
      null,
    );
    expect(changeResult).toStrictEqual({});

    await superuser.refresh();
    expect(superuser).toEqual({
      ...superuser,
      firstname: 'TestTest',
      lastname: 'TestTestTest',
      email: 'test@fs.de',
      studentid: null,
    });
  });

  test('can delete user', async () => {
    const superuser = await addTestSuperuser();
    await setLogin(superuser);
    const deleteResult = await deleteUser(
      superuser.userid,
    );
    expect(deleteResult).toStrictEqual({});

    await superuser.refresh();
    expect(superuser).toEqual({
      ...superuser,
      isactive: false,
    });
  });
});
