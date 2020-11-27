/* eslint-disable jest/no-conditional-expect */
import { AUDIT_REASON_MISSING_REVIEW_SUBMISSION, AUDIT_REASON_PARTIALLY_MISSING_REVIEW_SUBMISSION, AUDIT_REASON_PLAGIARISM, AUDIT_REASON_THRESHOLD, EFFORT, EFFORTS, ITS_OK_TO_FAIL, NOT_DONE, NOT_WRONG_RIGHT, NO_EFFORT, ONE_REVIEWER, POINTS, RIGHT, THRESHOLD_NA, TWO_REVIEWERS, WRONG, ZERO_TO_ONE_HUNDRED } from '../../src/utils/constants';
import { getPercentageGrade } from '../../src/utils/percentageGrade';
import addTestCourse from '../models/Course';
import { createTestStudents, runDistributionOfAudits, runDistributionOfReviews, runPositivePlagiarismCheck } from '../utils/helpers';

describe('distribution of audits', () => {
  test.each([
    ['one reviewer', 1, ONE_REVIEWER],
    ['two reviewers', 2, TWO_REVIEWERS],
  ])('no audits if everything is ok (%s)', async (_, reviewIntCount, reviewercount) => {
    // create course with two students
    const course = await addTestCourse();
    const students = await createTestStudents(3);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework({ reviewercount });
    const solutions = await Promise.all(students.map((student) => {
      return homework.addSolution({ userid: student.userid });
    }));

    // run distribution of reviews
    const solutionReviews = await runDistributionOfReviews(homework, solutions);
    for (const reviews of solutionReviews.toDo) {
      expect(reviews).toHaveLength(reviewIntCount);

      // submit the distributed reviews
      await Promise.all(reviews.map((review) => {
        return review.submit();
      }));
    }

    // run distribution of audits and verify that no reviews were created
    const solutionAudits = await runDistributionOfAudits(homework, solutions);
    for (const audits of solutionAudits) {
      expect(audits).toHaveLength(0);
    }
  });

  test.each([
    ['one reviewer', ONE_REVIEWER, THRESHOLD_NA, 0],
    ['two reviewers, samplesize', TWO_REVIEWERS, THRESHOLD_NA, 2],
    ['two reviewers, threshold', TWO_REVIEWERS, 30, 0],
  ])('audits if too few solutions (%s)', async (_, reviewercount, threshold, samplesize) => {
    // create course with two students
    const course = await addTestCourse();
    const students = await createTestStudents(2);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework({ reviewercount, threshold, samplesize });
    const solutions = await Promise.all(students.map((student) => {
      return homework.addSolution({ userid: student.userid });
    }));

    // run distribution of reviews
    const solutionReviews = await runDistributionOfReviews(homework, solutions);
    for (const reviews of solutionReviews.toDo) {
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

  test('audit when no submission (one reviewer)', async () => {
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
    for (const reviews of solutionReviews.toDo) {
      expect(reviews).toHaveLength(1);
    }

    // only student 1 submits a review
    await solutionReviews.toDo[0][0].submit();

    // run distribution of audits
    const solutionAudits = await runDistributionOfAudits(homework, solutions);

    // student 1 submitted a review, but did not receive any for himself
    expect(solutionAudits[0]).toHaveLength(1);
    expect(solutionAudits[0][0].reason).toBe(AUDIT_REASON_MISSING_REVIEW_SUBMISSION);

    // students 2 and 3 did not submit a review and one of them did not receive a review either

    // in either case, their grade should be set to 0
    for (const solution of solutions.slice(1)) {
      const reviews = await solution.getReviews();
      expect(reviews).toHaveLength(2);
      const systemreview = reviews.filter((r) => r.issystemreview)[0];
      expect(systemreview.percentagegrade).toBe(0);
    }

    // they should not receive any audits
    for (const audits of solutionAudits.slice(1)) {
      expect(audits).toHaveLength(0);
    }
  });

  test.each([
    ['efforts', EFFORTS, THRESHOLD_NA],
    ['points, threshold 30', POINTS, 30],
  ])('audit when no submission (two reviewers, %s)', async (_, evaluationvariant, threshold) => {
    // create course with four students
    const course = await addTestCourse();
    const students = await createTestStudents(4);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework({ reviewercount: TWO_REVIEWERS, samplesize: 5, evaluationvariant, threshold });
    const solutions = await Promise.all(students.map((student) => {
      return homework.addSolution({ userid: student.userid });
    }));

    // run distribution of reviews
    const solutionReviews = await runDistributionOfReviews(homework, solutions);
    for (const reviews of solutionReviews.toDo) {
      expect(reviews).toHaveLength(2);
    }

    // student 1 submits both reviews
    await solutionReviews.toDo[0][0].submit();
    await solutionReviews.toDo[0][1].submit();

    // student 1 receives a review
    await solutionReviews.toRecieve[0][0].submit();

    // student 2 receives both reviews but does not submit both
    await solutionReviews.toRecieve[1][0].submit({ percentagegrade: 100 });
    await solutionReviews.toRecieve[1][1].submit({ percentagegrade: 0 });

    // run distribution of audits
    const solutionAudits = await runDistributionOfAudits(homework, solutions);

    // student 1 submitted both reviews, but did not receive both for himself
    expect(solutionAudits[0]).toHaveLength(1);
    expect(solutionAudits[0][0].reason).toBe(AUDIT_REASON_PARTIALLY_MISSING_REVIEW_SUBMISSION);

    // students 2-4 did not submit both reviews
    // their grade should be set to 0
    for (const solution of solutions.slice(1)) {
      const reviews = await solution.getReviews();
      expect(reviews).toHaveLength(3);
      const systemreview = reviews.filter((r) => r.issystemreview)[0];
      expect(systemreview.percentagegrade).toBe(0);
    }

    // they should not receive any audits
    for (const audits of solutionAudits.slice(1)) {
      expect(audits).toHaveLength(0);
    }
  });

  test.each([
    ['one reviewer', ONE_REVIEWER, THRESHOLD_NA, 0],
    ['two reviewers, samplesize', TWO_REVIEWERS, THRESHOLD_NA, 2],
    ['two reviewers, threshold', TWO_REVIEWERS, 30, 0],
  ])('no new audits if plagiarism (%s)', async (_, reviewercount, threshold, samplesize) => {
    // create course with three students
    const course = await addTestCourse();
    const students = await createTestStudents(3);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework({ reviewercount, threshold, samplesize });
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

  test.each([
    ['efforts, t: 100, a: (NO_EFFORT, EFFORT), e: true', EFFORTS, 100, NO_EFFORT, EFFORT, true],
    ['NRR, t: 100, a: (WRONG, RIGHT), e: true', NOT_WRONG_RIGHT, 100, WRONG, RIGHT, true],
    ['NRR2, t: 100, a: (NOT_DONE, WRONG), e: true', ITS_OK_TO_FAIL, 100, NOT_DONE, WRONG, true],
    ['0-100, t: 50, a: (0, 50), e: true', ZERO_TO_ONE_HUNDRED, 50, 0, 50, true],
    ['0-100, t: 50, a: (0, 49), e: false', ZERO_TO_ONE_HUNDRED, 50, 0, 49, false],
    ['points, t: 50, a: (0, 500), e: true', POINTS, 50, 0, 500, true],
    ['points, t: 50, a: (0, 499), e: false', POINTS, 50, 0, 499, false],
  ])('audit when threshold is triggered (%s)', async (_, evaluationvariant, threshold, firstGrade, secondGrade, expectingThresholdViolation) => {
    // create course with three students
    const course = await addTestCourse();
    const students = await createTestStudents(3);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework({
      maxreachablepoints: 1000,
      reviewercount: TWO_REVIEWERS,
      threshold,
      evaluationvariant,
    });
    const solutions = await Promise.all(students.map((student) => {
      return homework.addSolution({ userid: student.userid });
    }));

    // run distribution of reviews
    const solutionReviews = await runDistributionOfReviews(homework, solutions);
    for (const reviews of solutionReviews.toRecieve) {
      expect(reviews).toHaveLength(2);

      await reviews[0].submit({ percentagegrade: getPercentageGrade(homework, firstGrade) });
      await reviews[1].submit({ percentagegrade: getPercentageGrade(homework, secondGrade) });
    }

    // run distribution of audits
    const solutionAudits = await runDistributionOfAudits(homework, solutions);
    for (const audits of solutionAudits) {
      if (expectingThresholdViolation) {
        // distribution of audits should create an audit for threshold violation
        expect(audits).toHaveLength(1);
        expect(audits[0].reason).toBe(AUDIT_REASON_THRESHOLD);
      } else {
        expect(audits).toHaveLength(0);
      }
    }
  });
});
