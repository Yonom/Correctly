import { AUDIT_REASON_MISSING_REVIEW_SUBMISSION, TWO_REVIEWERS } from '../../src/utils/constants';
import addTestCourse from '../models/Course';
import { createTestStudents, runDistributionOfReviews } from '../utils/helpers';

describe('distribution of reviews', () => {
  test('distributes reviews among students', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await createTestStudents(3);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework();
    const solutions = await Promise.all(students.map((student) => {
      return homework.addSolution({ userid: student.userid });
    }));

    // run distribution of reviews
    const solutionReviews = await runDistributionOfReviews(homework, solutions);
    for (const reviews of solutionReviews) {
      expect(reviews).toHaveLength(1);
    }
  });

  test('does not distribute among too few students', async () => {
    // create course with two students
    const course = await addTestCourse({ title: Math.random().toString() });
    const students = await createTestStudents(2);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework({ reviewercount: TWO_REVIEWERS });
    const solutions = await Promise.all(students.map((student) => {
      return homework.addSolution({ userid: student.userid });
    }));

    // run distribution of reviews
    const solutionReviews = await runDistributionOfReviews(homework, solutions);
    for (const reviews of solutionReviews) {
      // distribution of reviews will only distribute if there are 3 or more solutions
      // no reviews are be available here
      expect(reviews).toHaveLength(0);
    }

    // because no reviews were created, audits must be created to notify the lecturer
    for (const solution of solutions) {
      const audits = await solution.getAudits();
      expect(audits).toHaveLength(1);
      expect(audits[0].reason).toBe(AUDIT_REASON_MISSING_REVIEW_SUBMISSION);
    }
  });
});
