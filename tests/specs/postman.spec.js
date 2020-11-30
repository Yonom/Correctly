import { addTestLecturer } from '../models/User';
import { getPostman } from '../utils/helpers';
import { loginAsRole, NOONE, PERMISSIONS } from '../utils/permissionUtils';
import setLogin from '../utils/setLogin';

describe('postman', () => {
  test('postman URL is unavailable in non-development environment', async () => {
    const lecturer = await addTestLecturer();

    await setLogin(lecturer);
    await expect(async () => {
      await getPostman();
    }).rejects.toStrictEqual({ code: 'auth/unauthorized' });
  });

  test.each(PERMISSIONS)('postman permissions test for %s', async (role) => {
    await loginAsRole(role);

    // api/postman
    await expect(async () => {
      await getPostman();
    }).checkPermission(role, NOONE);
  });
});
