import { addTestCourse } from '../models/Course';
import { addTestLecturer, addTestStudent, addTestSuperuser } from '../models/User';
import { addTestStudents } from './helpers';
import setLogin from './setLogin';

export const PERMISSIONS = [
  'guest',
  'student',
  'lecturer',
  'superuser',
];

export const COURSE_PERMISISONS = [
  'guest',
  'student',
  'course-student',
  'lecturer',
  'course-lecturer',
  'course-module-coordinator',
  'superuser',
];

export const EVERYONE = [true, true, true, true, true, true, true];
export const LOGGED_IN = [false, true, true, true, true, true, true];
export const LECTURER = [false, false, false, true, true, true, true];
export const SUPERUSER = [false, false, false, false, false, false, true];
export const NOONE = [false, false, false, false, false, false, false];

export const COURSE_STUDENT_NO_SUPERUSER = [false, false, true, false, false, false, false];
export const COURSE_MEMBER = [false, false, true, false, true, true, true];
export const COURSE_STUDENT = [false, false, true, false, false, false, true];
export const COURSE_LECTURER = [false, false, false, false, true, true, true];

export const loginAsRole = async (role, courseModuleCoordinator, courseLecturer, courseStudent) => {
  switch (role) {
    case 'guest':
      return setLogin();

    case 'deleted':
      return setLogin(await addTestSuperuser({ isactive: false }));

    case 'student':
      return setLogin(await addTestStudent());

    case 'course-student':
      return setLogin(courseStudent);

    case 'lecturer':
      return setLogin(await addTestLecturer());

    case 'course-lecturer':
      return setLogin(courseLecturer);

    case 'course-module-coordinator':
      return setLogin(courseModuleCoordinator);

    case 'superuser':
      return setLogin(await addTestSuperuser());

    default:
      throw new Error('Unknown role');
  }
};

const noPermErrorCodes = [
  'auth/not-logged-in',
  'auth/unauthorized',
  'course/not-found',
  'homework/not-found',
  'solution/not-found',
  'review/not-found',
];

expect.extend({
  async checkPermission(callback, role, profile) {
    let received = false;
    try {
      await callback();
      received = true;
    } catch (e) {
      if (!noPermErrorCodes.includes(e.code)) {
        throw e;
      }
    }

    const roleIndex = COURSE_PERMISISONS.indexOf(role);
    const expected = profile[roleIndex];

    return {
      pass: received === expected,
      message: () => {
        return (
          `${this.utils.matcherHint('checkPermission', undefined, undefined)}\n`
          + `Expected: ${this.utils.printExpected(expected ? `${role} has permission` : `${role} does not have permission`)}\n`
          + `Received: ${this.utils.printReceived(received ? `${role} has permission` : `${role} does not have permission`)}`
        );
      },
    };
  },
});

export const loginAsCourseRole = async (role, submitSolutions = null) => {
  // create course with three students
  const course = await addTestCourse();

  const lecturer = await addTestLecturer();
  await course.addAttendee({ userid: lecturer.userid, islecturer: true });

  const moduleCoordinator = await addTestLecturer();
  await course.addAttendee({ userid: moduleCoordinator.userid, ismodulecoordinator: true });

  const students = await addTestStudents(submitSolutions !== false ? 3 : 4);
  for (const s of students) {
    await course.addAttendee({ userid: s.userid, isstudent: true });
  }

  const homework = await course.addHomework();

  let solutions = [];
  if (submitSolutions !== null) {
    solutions = await Promise.all(students.slice(0, 3).map((student) => {
      return homework.addSolution({ userid: student.userid });
    }));
  }

  await loginAsRole(role, moduleCoordinator, lecturer, students[submitSolutions !== false ? 0 : 3]);
  return { course, homework, lecturer, students, solutions };
};
