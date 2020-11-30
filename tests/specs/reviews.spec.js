import { addLecturerReview, changeReview } from '../../src/services/reviews';
import { downloadSolution, downloadReview, getMyReviews, showReview, runDistributionOfReviews, getReview, runDistributionOfAudits } from '../utils/helpers';
import { loginAsCourseRole, COURSE_PERMISISONS, COURSE_LECTURER, LOGGED_IN, COURSE_MEMBER, SUPERUSER, COURSE_STUDENT, NOONE } from '../utils/permissionUtils';

describe('reviews', () => {
  test.each(COURSE_PERMISISONS)('reviews permissions test for %s', async (role) => {
    const { homework, solutions } = await loginAsCourseRole(role, true);
    const { toDo: [[review], [otherReview]], toReceive: [[receiveReview]] } = await runDistributionOfReviews(homework, solutions);

    // api/reviews/add
    await expect(async () => {
      await addLecturerReview(solutions[0].id, null, null, 'Hello world');
    }).checkPermission(role, COURSE_LECTURER);

    // api/solutions/downloadSolution (my target)
    await expect(async () => {
      await downloadSolution(review.solutionid);
    }).checkPermission(role, COURSE_MEMBER);

    // api/reviews/get (my)
    await expect(async () => {
      await getReview(review.id);
    }).checkPermission(role, COURSE_STUDENT);

    // api/reviews/get (reviewee)
    await expect(async () => {
      await getReview(receiveReview.id);
    }).checkPermission(role, SUPERUSER);

    // api/reviews/get (other)
    await expect(async () => {
      await getReview(otherReview.id);
    }).checkPermission(role, SUPERUSER);

    // api/reviews/edit (my)
    await expect(async () => {
      await changeReview(review.id, 0);
    }).checkPermission(role, COURSE_STUDENT);

    // api/reviews/edit (reviewee)
    await expect(async () => {
      await changeReview(receiveReview.id, 0);
    }).checkPermission(role, SUPERUSER);

    // api/reviews/edit (other)
    await otherReview.refresh();
    await expect(async () => {
      if (!otherReview.issubmitted) {
        await changeReview(otherReview.id, 0);
      }
    }).checkPermission(role, SUPERUSER);

    await review.submit({ percentagegrade: 0, reviewfiles: ['Test'], reviewfilenames: ['Test.pdf'] });
    await receiveReview.submit({ percentagegrade: 0, reviewfiles: ['Test'], reviewfilenames: ['Test.pdf'] });
    await otherReview.submit({ percentagegrade: 0, reviewfiles: ['Test'], reviewfilenames: ['Test.pdf'] });

    // api/reviews/downloadReview (my)
    await expect(async () => {
      await downloadReview(review.id);
    }).checkPermission(role, COURSE_LECTURER);

    // api/reviews/downloadReview (revieweee)
    await expect(async () => {
      await downloadReview(receiveReview.id);
    }).checkPermission(role, COURSE_LECTURER);

    // api/reviews/downloadReview (other)
    await expect(async () => {
      await downloadReview(otherReview.id);
    }).checkPermission(role, COURSE_LECTURER);

    // api/reviews/my
    await expect(async () => {
      await getMyReviews();
    }).checkPermission(role, LOGGED_IN);

    // api/reviews/show (my)
    await expect(async () => {
      await showReview(review.id);
    }).checkPermission(role, COURSE_LECTURER);

    // api/reviews/show (reviewee)
    await expect(async () => {
      await showReview(receiveReview.id);
    }).checkPermission(role, COURSE_LECTURER);

    // api/reviews/show (other)
    await expect(async () => {
      await showReview(otherReview.id);
    }).checkPermission(role, COURSE_LECTURER);

    await review.set({ issubmitted: false });
    await runDistributionOfAudits(homework);

    // api/reviews/edit (my, after submission timeframe end)
    await expect(async () => {
      await changeReview(review.id, 0);
    }).checkPermission(role, NOONE);
  });
});
