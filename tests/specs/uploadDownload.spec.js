import moment from 'moment';
import { addHomework } from '../../src/services/homeworks';
import { changeReview } from '../../src/services/reviews';
import { addSolution } from '../../src/services/solutions';
import { AUDIT_BY_LECTURERS, EFFORTS, ONE_REVIEWER, TEXTFIELD, THRESHOLD_NA } from '../../src/utils/constants';
import { addTestCourse } from '../models/Course';
import { addTestLecturer } from '../models/User';
import { addTestStudents, downloadHomeworkEvaluationScheme, downloadHomeworkSampleSolution, downloadHomeworkTask, downloadReview, downloadSolution, runDistributionOfReviews } from '../utils/helpers';
import setLogin from '../utils/setLogin';

describe('upload and download', () => {
  test('can upload and download homework task', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await addTestStudents(1);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // add a lecturer
    const lecturer = await addTestLecturer();
    await course.addAttendee({ userid: lecturer.userid, islecturer: true });

    // create a homework
    await setLogin(lecturer);
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
      `data:text/plain;base64,${btoa('File content')}`,
      'Test.pdf',
      null,
      null,
      null,
      null,
    );

    const [homework] = await course.getHomeworks();

    await setLogin(students[0]);
    const task = await downloadHomeworkTask(homework.id);

    expect(task.name).toBe('Test.pdf');
    expect(task.content).toBe('File content');
  });

  test('cannot download homework sample solution before distribution of reviews', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await addTestStudents(1);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // add a lecturer
    const lecturer = await addTestLecturer();
    await course.addAttendee({ userid: lecturer.userid, islecturer: true });

    // create a homework
    await setLogin(lecturer);
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
      null,
      null,
      `data:text/plain;base64,${btoa('File content')}`,
      'Test.pdf',
      null,
      null,
    );

    const [homework] = await course.getHomeworks();

    await setLogin(students[0]);
    await expect(async () => {
      await downloadHomeworkSampleSolution(homework.id);
    }).rejects.toStrictEqual({ code: 'homework/not-found' });
  });

  test('cannot download homework evaluation scheme before distribution of reviews', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await addTestStudents(1);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // add a lecturer
    const lecturer = await addTestLecturer();
    await course.addAttendee({ userid: lecturer.userid, islecturer: true });

    // create a homework
    await setLogin(lecturer);
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
      null,
      null,
      null,
      null,
      `data:text/plain;base64,${btoa('File content')}`,
      'Test.pdf',
    );

    const [homework] = await course.getHomeworks();

    await setLogin(students[0]);
    await expect(async () => {
      await downloadHomeworkEvaluationScheme(homework.id);
    }).rejects.toStrictEqual({ code: 'homework/not-found' });
  });

  test('can upload and download homework sample solution', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await addTestStudents(1);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // add a lecturer
    const lecturer = await addTestLecturer();
    await course.addAttendee({ userid: lecturer.userid, islecturer: true });

    // create a homework
    await setLogin(lecturer);
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
      null,
      null,
      `data:text/plain;base64,${btoa('File content')}`,
      'Test.pdf',
      null,
      null,
    );

    const [homework] = await course.getHomeworks();

    await runDistributionOfReviews(homework);

    await setLogin(students[0]);
    const sampleSolution = await downloadHomeworkSampleSolution(homework.id);

    expect(sampleSolution.name).toBe('Test.pdf');
    expect(sampleSolution.content).toBe('File content');
  });

  test('can upload and download homework evaluation scheme', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await addTestStudents(1);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // add a lecturer
    const lecturer = await addTestLecturer();
    await course.addAttendee({ userid: lecturer.userid, islecturer: true });

    // create a homework
    await setLogin(lecturer);
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
      null,
      null,
      null,
      null,
      `data:text/plain;base64,${btoa('File content')}`,
      'Test.pdf',
    );

    const [homework] = await course.getHomeworks();

    await runDistributionOfReviews(homework);

    await setLogin(students[0]);
    const evaluationScheme = await downloadHomeworkEvaluationScheme(homework.id);

    expect(evaluationScheme.name).toBe('Test.pdf');
    expect(evaluationScheme.content).toBe('File content');
  });

  test('can upload and download solution', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await addTestStudents(1);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework({ solutionallowedformats: ['.pdf'] });

    await setLogin(students[0]);
    await addSolution(homework.id, `data:text/plain;base64,${btoa('File content')}`, 'Test.pdf', null);
    const [solution] = await homework.getSolutions();

    await runDistributionOfReviews(homework);

    await setLogin(students[0]);
    const file = await downloadSolution(solution.id);

    expect(file.name).toBe('Test.pdf');
    expect(file.content).toBe('File content');
  });

  test('can upload and download review', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await addTestStudents(3);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework({ reviewallowedformats: ['.pdf'] });
    const solutions = await Promise.all(students.map((student) => {
      return homework.addSolution({ userid: student.userid });
    }));

    // run distribution of reviews
    const solutionReviews = await runDistributionOfReviews(homework, solutions);
    await setLogin(students[0]);
    await changeReview(solutionReviews.toDo[0][0].id, 100, `data:text/plain;base64,${btoa('File content')}`, 'Test.pdf', null);

    // add a lecturer
    const lecturer = await addTestLecturer();
    await course.addAttendee({ userid: lecturer.userid, islecturer: true });

    await setLogin(lecturer);
    const review = await downloadReview(solutionReviews.toDo[0][0].id);

    expect(review.name).toBe('Test.pdf');
    expect(review.content).toBe('File content');
  });
});
