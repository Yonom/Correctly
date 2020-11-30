import moment from 'moment';
import { addHomework, editHomework, getHomeworkCSV, homeworksPublishGrades } from '../../src/services/homeworks';
import { AUDIT_BY_LECTURERS, EFFORTS, ONE_REVIEWER, TEXTFIELD, THRESHOLD_NA } from '../../src/utils/constants';
import { downloadHomeworkEvaluationScheme, downloadHomeworkSampleSolution, downloadHomeworkTask, getHomework, getMyEditableHomeworks, getMyHomeworks, runDistributionOfReviews } from '../utils/helpers';
import { LOGGED_IN, COURSE_PERMISISONS, loginAsCourseRole, COURSE_MEMBER, COURSE_LECTURER, LECTURER } from '../utils/permissionUtils';

describe('homeworks', () => {
  test.each(COURSE_PERMISISONS)('homeworks permissions test for %s', async (role) => {
    const { course, homework } = await loginAsCourseRole(role);

    // api/homework/add
    await expect(async () => {
      await addHomework(
        'Test Homework',
        [course.id],
        10,
        EFFORTS,
        ONE_REVIEWER,
        AUDIT_BY_LECTURERS,
        0,
        THRESHOLD_NA,
        [TEXTFIELD],
        [TEXTFIELD],
        moment().toDate(),
        moment().add(1, 'day').toDate(),
        moment().add(1, 'day').toDate(),
        moment().add(2, 'days').toDate(),
      );
    }).checkPermission(role, COURSE_LECTURER);

    // api/homework/downloadTask
    await expect(async () => {
      await downloadHomeworkTask(homework.id);
    }).checkPermission(role, COURSE_MEMBER);

    // api/homework/downloadSampleSolution (before distribution of reviews)
    await expect(async () => {
      await downloadHomeworkSampleSolution(homework.id);
    }).checkPermission(role, COURSE_LECTURER);

    // api/homework/downloadEvaluationScheme (before distribution of reviews)
    await expect(async () => {
      await downloadHomeworkEvaluationScheme(homework.id);
    }).checkPermission(role, COURSE_LECTURER);

    await runDistributionOfReviews(homework);

    // api/homework/downloadSampleSolution (after distribution of reviews)
    await expect(async () => {
      await downloadHomeworkSampleSolution(homework.id);
    }).checkPermission(role, COURSE_MEMBER);

    // api/homework/downloadEvaluationScheme (after distribution of reviews)
    await expect(async () => {
      await downloadHomeworkEvaluationScheme(homework.id);
    }).checkPermission(role, COURSE_MEMBER);

    // api/homework/get
    await expect(async () => {
      await getHomework(homework.id);
    }).checkPermission(role, COURSE_MEMBER);

    // api/homeworks/getCSV
    await expect(async () => {
      await getHomeworkCSV(homework.id);
    }).checkPermission(role, COURSE_LECTURER);

    // api/homeworks/my
    await expect(async () => {
      await getMyHomeworks();
    }).checkPermission(role, LOGGED_IN);

    // api/homeworks/myEditable
    await expect(async () => {
      await getMyEditableHomeworks();
    }).checkPermission(role, LECTURER);

    // api/homeworks/publishGrades
    await expect(async () => {
      await homeworksPublishGrades(homework.id);
    }).checkPermission(role, COURSE_LECTURER);

    // api/homeworks/edit
    await expect(async () => {
      await editHomework(
        'Test Homework',
        10,
        EFFORTS,
        ONE_REVIEWER,
        AUDIT_BY_LECTURERS,
        5,
        THRESHOLD_NA,
        [TEXTFIELD],
        [TEXTFIELD],
        moment().toDate(),
        moment().add(1, 'day').toDate(),
        moment().add(1, 'day').toDate(),
        moment().add(2, 'days').toDate(),
        null,
        null,
        null,
        null,
        null,
        null,
        homework.id,
      );
    }).checkPermission(role, COURSE_LECTURER);
  });
});
