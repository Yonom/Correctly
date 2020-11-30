import { getMyData } from '../../src/services/auth';
import { changeUser, deleteUser, setBiography } from '../../src/services/users';
import { addTestStudent } from '../models/User';
import { getAllUsers, getUser } from '../utils/helpers';
import { loginAsRole, PERMISSIONS, LOGGED_IN, LECTURER, SUPERUSER } from '../utils/permissionUtils';

describe('users', () => {
  test.each(PERMISSIONS)('users permissions test for %s', async (role) => {
    await loginAsRole(role);
    const student = await addTestStudent();

    const { userId } = await getMyData();

    // api/users/all
    await expect(async () => {
      await getAllUsers();
    }).checkPermission(role, LECTURER);

    // api/users/change
    await expect(async () => {
      await changeUser(userId, 'TestTest', 'TestTestTest', 'test@fs-students.de', 1234567);
    }).checkPermission(role, SUPERUSER);

    // api/users/get
    await expect(async () => {
      await getUser(userId);
    }).checkPermission(role, LOGGED_IN);

    // api/users/setBiography (self)
    await expect(async () => {
      await setBiography(userId, 'Abcd');
    }).checkPermission(role, LOGGED_IN);

    // api/users/setBiography (others)
    await expect(async () => {
      await setBiography(student.userid);
    }).checkPermission(role, SUPERUSER);

    // api/users/delete
    await expect(async () => {
      await deleteUser(userId);
    }).checkPermission(role, SUPERUSER);
  });
});
