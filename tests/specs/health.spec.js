import { getHealth } from '../utils/helpers';
import { loginAsRole, PERMISSIONS, EVERYONE } from '../utils/permissionUtils';

describe('health check', () => {
  test('health check passes', async () => {
    const health = await getHealth();
    expect(health).toStrictEqual({});
  });

  test.each(PERMISSIONS)('health check permissions test for %s', async (role) => {
    await loginAsRole(role);

    // api/health
    await expect(async () => {
      await getHealth();
    }).checkPermission(role, EVERYONE);
  });
});
