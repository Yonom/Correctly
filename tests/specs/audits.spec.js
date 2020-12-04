import { resolveAudit } from '../../src/services/audits';
import { AUDIT_BY_MODULE_COORDINATOR } from '../../src/utils/constants';
import { getAudit, getHasAudit, getMyAudits } from '../utils/helpers';
import { LOGGED_IN, COURSE_PERMISISONS, loginAsCourseRole, COURSE_LECTURER } from '../utils/permissionUtils';

describe('audits', () => {
  test.each(COURSE_PERMISISONS)('audits permissions test for %s', async (role) => {
    const { homework, solutions: [mySolution, mySolution2] } = await loginAsCourseRole(role, true);
    await mySolution.addAudit();
    await mySolution2.addAudit();

    // api/audits/my
    await expect(async () => {
      await getMyAudits();
    }).checkPermission(role, LOGGED_IN);

    let hasAuditResult;
    // api/audits/has (lecturers see audits)
    await expect(async () => {
      hasAuditResult = await getHasAudit(mySolution.id);
    }).checkPermission(role, COURSE_LECTURER);

    // api/audits/get (lecturers see audits)
    await expect(async () => {
      if (hasAuditResult?.hasaudit === false) return;
      await getAudit(mySolution.id);
    }).checkPermission(role, COURSE_LECTURER);

    // api/audits/resolve (lecturers see audits)
    await expect(async () => {
      if (hasAuditResult?.hasaudit === false) return;
      await resolveAudit(mySolution.id);
    }).checkPermission(role, COURSE_LECTURER);

    await homework.set({ auditors: AUDIT_BY_MODULE_COORDINATOR });

    let hasAuditResult2 = true;
    // api/audits/has (module coordinator sees audits)
    await expect(async () => {
      hasAuditResult2 = await getHasAudit(mySolution2.id);
    }).checkPermission(role, COURSE_LECTURER);

    // api/audits/get (module coordinator sees audits)
    await expect(async () => {
      if (hasAuditResult2?.hasaudit === false) return;
      await getAudit(mySolution2.id);
    }).checkPermission(role, COURSE_LECTURER);

    // api/audits/resolve (module coordinator sees audits)
    await expect(async () => {
      if (hasAuditResult2?.hasaudit === false) return;
      await resolveAudit(mySolution2.id);
    }).checkPermission(role, COURSE_LECTURER);
  });
});
