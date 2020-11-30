import { getMyData } from '../../src/services/auth';
import { addSolution } from '../../src/services/solutions';
import { downloadSolution, getSolution, runDistributionOfReviews } from '../utils/helpers';
import { COURSE_LECTURER, COURSE_PERMISISONS, COURSE_STUDENT_NO_SUPERUSER, loginAsCourseRole, NOONE } from '../utils/permissionUtils';

describe('solutions', () => {
  test.each(COURSE_PERMISISONS)('solutions permissions test for %s', async (role) => {
    const { homework, solutions: [otherSolution] } = await loginAsCourseRole(role, false);

    const { userId } = await getMyData();
    let mySolution;
    // api/solutions/add
    await expect(async () => {
      await addSolution(homework.id, null, null, 'Hello world');
    }).checkPermission(role, COURSE_STUDENT_NO_SUPERUSER);

    // api/solutions/get (my)
    await expect(async () => {
      mySolution = await getSolution(homework.id, userId);
    }).checkPermission(role, COURSE_STUDENT_NO_SUPERUSER);

    if (mySolution) {
      // api/solutions/downloadSolution (my)
      await expect(async () => {
        await downloadSolution(mySolution.solution.id);
      }).checkPermission(role, COURSE_STUDENT_NO_SUPERUSER);
    }

    // api/solutions/get (other)
    await expect(async () => {
      mySolution = await getSolution(homework.id, otherSolution.userid);
    }).checkPermission(role, COURSE_LECTURER);

    // api/solutions/downloadSolution (other)
    await expect(async () => {
      await downloadSolution(otherSolution.id);
    }).checkPermission(role, COURSE_LECTURER);
  });

  test.each(COURSE_PERMISISONS)('solutions permissions test 2 for %s', async (role) => {
    const { homework } = await loginAsCourseRole(role, false);

    await runDistributionOfReviews(homework);

    // api/solutions/add
    await expect(async () => {
      await addSolution(homework.id, null, null, 'Hello world');
    }).checkPermission(role, NOONE);
  });
});
