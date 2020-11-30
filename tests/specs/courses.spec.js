import { editCourse, getCourseCSV } from '../../src/services/courses';
import { addTestCourseViaAPI, getCourse, getMyCourses, getMyEditableCourses } from '../utils/helpers';
import { LOGGED_IN, COURSE_PERMISISONS, loginAsCourseRole, COURSE_MEMBER, COURSE_LECTURER, LECTURER } from '../utils/permissionUtils';

describe('courses', () => {
  test.each(COURSE_PERMISISONS)('courses permissions test for %s', async (role) => {
    const { course, lecturer } = await loginAsCourseRole(role);

    // api/courses/add
    await expect(async () => {
      await addTestCourseViaAPI('Test', [
        { userid: lecturer.userid, selectedLecturer: true },
      ]);
    }).checkPermission(role, LECTURER);

    // api/courses/get
    await expect(async () => {
      await getCourse(course.id);
    }).checkPermission(role, COURSE_MEMBER);

    // api/courses/getCSV
    await expect(async () => {
      await getCourseCSV(course.id);
    }).checkPermission(role, COURSE_LECTURER);

    // api/courses/my
    await expect(async () => {
      await getMyCourses();
    }).checkPermission(role, LOGGED_IN);

    // api/courses/myEditable
    await expect(async () => {
      await getMyEditableCourses();
    }).checkPermission(role, LECTURER);

    // api/courses/edit
    await expect(async () => {
      await editCourse(course.id, 'Hello', course.yearcode, [
        { userid: lecturer.userid, selectedLecturer: true },
      ]);
    }).checkPermission(role, COURSE_LECTURER);
  });
});
