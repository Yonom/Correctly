import { runDistribution } from '../utils/helpers';
import { loginAsRole, PERMISSIONS, EVERYONE } from '../utils/permissionUtils';

describe('cron job', () => {
  test.each(PERMISSIONS)('cron distribtuion job permissions test for %s', async (role) => {
    await loginAsRole(role);

    // api/cron/distribution
    await expect(async () => {
      await runDistribution();
    }).checkPermission(role, EVERYONE);
  });
});
