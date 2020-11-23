import setLogin from '../utils/setLogin';
import { addTestLecturer } from '../models/User';
import addTestCourse from '../models/Course';
import { getCourseCSV } from '../../src/services/courses';
import { createTestStudents } from '../utils/helpers';

describe('csv', () => {
  test('cannot download unauthorized CSV', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await createTestStudents(3);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework();
    await Promise.all(students.map((student) => {
      return homework.addSolution({ userid: student.userid });
    }));

    const lecturer = await addTestLecturer();
    await setLogin(lecturer);

    // lecturer is NOT part of course, therefore we expect an error
    await expect(async () => {
      await getCourseCSV(course.id);
    }).rejects.toStrictEqual({ code: 'course/not-found' });
  });

  test('can download empty CSV', async () => {
    // create course with three students
    const course = await addTestCourse();
    const lecturer = await addTestLecturer();
    await course.addAttendee({ userid: lecturer.userid, islecturer: true });

    await setLogin(lecturer);

    // expect an empty CSV
    const csv = await getCourseCSV(course.id);
    expect(csv).toStrictEqual([]);
  });
});
