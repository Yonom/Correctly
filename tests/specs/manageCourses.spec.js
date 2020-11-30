import { editCourse } from '../../src/services/courses';
import { addTestLecturer, addTestSuperuser } from '../models/User';
import { addTestCourseViaAPI, addTestStudents, getCourse, getMyEditableCourses } from '../utils/helpers';
import setLogin from '../utils/setLogin';

describe('manage courses', () => {
  test('create, edit and list courses', async () => {
    const lecturer = await addTestLecturer();

    await setLogin(lecturer);
    const course = await addTestCourseViaAPI('Test', [
      { userid: lecturer.userid, selectedLecturer: true },
    ]);

    const attendees = await course.getAttendees();
    expect(attendees).toHaveLength(1);
    expect(attendees[0].userid).toBe(lecturer.userid);
    expect(attendees[0].islecturer).toBe(true);

    // create course with three students
    const students = await addTestStudents(3);
    await editCourse(course.id, 'Hello world', course.yearcode, [
      { userid: lecturer.userid, selectedLecturer: true },
      ...(students.map((student) => (
        { userid: student.userid, selectedStudent: true }
      ))),
    ]);

    await course.refresh();
    expect(course.title).toBe('Hello world');

    const courseObj = await getCourse(course.id);
    expect(courseObj).toEqual({
      ...courseObj,
      id: course.id,
      title: course.title,
      yearcode: course.yearcode,
    });

    const attendees2 = await course.getAttendees();
    expect(attendees2).toHaveLength(4);

    const lecturerCourses = await getMyEditableCourses();
    expect(lecturerCourses).toHaveLength(1);
    expect(lecturerCourses[0].courseId).toBe(course.id);

    const superuser = await addTestSuperuser();
    await setLogin(superuser);
    const superuserCourses = await getMyEditableCourses();
    const filteredSuperuserCourses = superuserCourses.filter((c) => c.courseId === course.id);
    expect(filteredSuperuserCourses).toHaveLength(1);
  });
});
