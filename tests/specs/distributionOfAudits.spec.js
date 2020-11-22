/* eslint-disable jest/no-conditional-expect */
import { AUDIT_REASON_DID_NOT_SUBMIT_REVIEW, AUDIT_REASON_MISSING_REVIEW_SUBMISSION, AUDIT_REASON_PLAGIARISM, AUDIT_REASON_SAMPLESIZE } from '../../src/utils/constants';
import addTestCourse from '../models/Course';
import { createTestStudents, runDistributionOfAudits, runDistributionOfReviews, runPositivePlagiarismCheck } from '../utils/helpers';

describe('distribution of audits', () => {
  test('no audits if everything is ok', async () => {
    // create course with two students
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

      // submit the distributed reviews
      await reviews[0].set({
        issubmitted: true,
        percentagegrade: 100,
      });
    }

    // run distribution of audits and verify that no reviews were created
    const solutionAudits = await runDistributionOfAudits(homework, solutions);
    for (const audits of solutionAudits) {
      expect(audits).toHaveLength(0);
    }
  });

  test('audits if too few solutions', async () => {
    // create course with two students
    const course = await addTestCourse();
    const students = await createTestStudents(2);
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
      // distribution of reviews will only distribute if there are 3 or more solutions
      // no reviews are be available here
      expect(reviews).toHaveLength(0);
    }

    // because no reviews were created, audits are created by dsitribution of reviews
    for (const solution of solutions) {
      const audits = await solution.getAudits();
      expect(audits).toHaveLength(1);
      expect(audits[0].reason).toBe(AUDIT_REASON_MISSING_REVIEW_SUBMISSION);
    }

    // run distribution of audits and verify that the result is same
    const solutionAudits = await runDistributionOfAudits(homework, solutions);
    for (const audits of solutionAudits) {
      expect(audits).toHaveLength(1);
      expect(audits[0].reason).toBe(AUDIT_REASON_MISSING_REVIEW_SUBMISSION);
    }
  });

  test('audit when no submission', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await createTestStudents(3);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework({ });
    const solutions = await Promise.all(students.map((student) => {
      return homework.addSolution({ userid: student.userid });
    }));

    // run distribution of reviews
    const solutionReviews = await runDistributionOfReviews(homework, solutions);
    for (const reviews of solutionReviews) {
      expect(reviews).toHaveLength(1);
    }

    // run distribution of audits
    const solutionAudits = await runDistributionOfAudits(homework, solutions);

    // students did not submit a review and did not receive a review either
    // in either case, their grade should be set to 0
    for (const solution of solutions.slice(1)) {
      const reviews = await solution.getReviews();
      expect(reviews).toHaveLength(2);
      const systemreview = reviews.filter((r) => r.issystemreview)[0];
      expect(systemreview.percentagegrade).toBe(0);
    }

    // they should also receive audits of kind 'did-not-submit-review'
    for (const audits of solutionAudits.slice(1)) {
      expect(audits).toHaveLength(1);
      expect(audits[0].reason).toBe(AUDIT_REASON_DID_NOT_SUBMIT_REVIEW);
    }
  });

  test('audit if samplesize was selected', async () => {
    const samplesize = 2;

    // create course with three students
    const course = await addTestCourse();
    const students = await createTestStudents(3);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework with samplesize and submit solutions for every student
    const homework = await course.addHomework({ samplesize });
    const solutions = await Promise.all(students.map((student) => {
      return homework.addSolution({ userid: student.userid });
    }));

    // run distribution of reviews
    const solutionReviews = await runDistributionOfReviews(homework, solutions);
    for (const reviews of solutionReviews) {
      expect(reviews).toHaveLength(1);

      // submit the distributed reviews
      await reviews[0].set({
        issubmitted: true,
        percentagegrade: 100,
      });
    }

    // run distribution of audits
    const solutionAudits = await runDistributionOfAudits(homework, solutions);
    let auditCount = 0;
    for (const audits of solutionAudits) {
      // samplesize must cause all solutions to have audits
      if (audits.length > 0) {
        auditCount += 1;
        expect(audits).toHaveLength(1);
        expect(audits[0].reason).toBe(AUDIT_REASON_SAMPLESIZE);
      }
    }
    expect(auditCount).toBe(Math.min(solutions.length, samplesize));
  });

  test('no new audits if plagiarism', async () => {
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

    // simulate distribution of reviews causing a positive plagiarism check on all solutions
    const [solutionReviews, solutionPlagiarismAudits] = await runPositivePlagiarismCheck(homework, solutions);
    for (const reviews of solutionReviews) {
      // plagiarism causes a systemreview of 0 points
      expect(reviews).toHaveLength(1);
      expect(reviews[0].issystemreview).toBe(true);
      expect(reviews[0].percentagegrade).toBe(0);
    }
    for (const audits of solutionPlagiarismAudits) {
      // plagiarism causes an audit with reason plagiarism
      expect(audits).toHaveLength(1);
      expect(audits[0].reason).toBe(AUDIT_REASON_PLAGIARISM);
    }

    // run distribution of audits
    const solutionAudits = await runDistributionOfAudits(homework, solutions);
    for (const audits of solutionAudits) {
      // distribution of audits may not create any new audits
      expect(audits).toHaveLength(1);
      expect(audits[0].reason).toBe(AUDIT_REASON_PLAGIARISM);
    }
  });
});
