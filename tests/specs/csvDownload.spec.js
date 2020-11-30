import setLogin from '../utils/setLogin';
import { addTestLecturer } from '../models/User';
import { addTestCourse } from '../models/Course';
import { getCourseCSV } from '../../src/services/courses';
import { addTestStudents } from '../utils/helpers';
import { getHomeworkCSV } from '../../src/services/homeworks';

describe('csv', () => {
  test('cannot download unauthorized CSV', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await addTestStudents(3);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework();
    await Promise.all(students.map((student) => {
      return homework.addSolution({ userid: student.userid });
    }));

    const lecturer = await addTestLecturer();

    // lecturer is NOT part of course, therefore we expect an error
    await setLogin(lecturer);
    await expect(async () => {
      await getCourseCSV(course.id);
    }).rejects.toStrictEqual({ code: 'course/not-found' });

    await expect(async () => {
      await getHomeworkCSV(course.id);
    }).rejects.toStrictEqual({ code: 'homework/not-found' });

    // student is NOT lecturer, therefore we expect an error
    await setLogin(students[0]);
    await expect(async () => {
      await getCourseCSV(course.id);
    }).rejects.toStrictEqual({ code: 'auth/unauthorized' });

    await expect(async () => {
      await getHomeworkCSV(course.id);
    }).rejects.toStrictEqual({ code: 'auth/unauthorized' });
  });

  test('can download homework CSV', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await addTestStudents(3);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework();
    await Promise.all(students.map((student) => {
      return homework.addSolution({ userid: student.userid });
    }));

    const lecturer = await addTestLecturer();
    await course.addAttendee({ userid: lecturer.userid, islecturer: true });
    await setLogin(lecturer);

    // lecturer is NOT part of course, therefore we expect an error
    const homeworkCSV = await getHomeworkCSV(homework.id);
    expect(homeworkCSV).toHaveLength(3);
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
