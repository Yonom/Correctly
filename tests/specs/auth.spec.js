import { getMyData, logout } from '../../src/services/auth';
import { loginAsRole, PERMISSIONS, EVERYONE, LOGGED_IN } from '../utils/permissionUtils';

describe('auth', () => {
  test.each(PERMISSIONS)('auth permissions test for %s', async (role) => {
    await loginAsRole(role);

    // api/auth/logout
    await expect(async () => {
      await logout();
    }).checkPermission(role, LOGGED_IN);

    // api/auth/me
    await expect(async () => {
      await getMyData();
    }).checkPermission(role, EVERYONE);
  });
});
