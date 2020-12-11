import { addTestCourse } from '../models/Course';
import { addTestStudents, runDistributionOfAudits, runDistributionOfReviews } from '../utils/helpers';
import { createChecking, findDuplicates, findSimilarities, getSimilaritiesForSolutions, generatePlagiarismIds } from '../../src/utils/plagiarismCheck/check';
import { AUDIT_REASON_PLAGIARISM } from '../../src/utils/constants';

const getMatchesForSolutionSimilarities = (solutions, sims) => {
  const solutionSimilarities = getSimilaritiesForSolutions(solutions, generatePlagiarismIds(sims));
  const result = {};
  solutionSimilarities.forEach(({ solution, similarities }) => {
    result[solution.id] = similarities.map((s) => s.solution.solutionId);
  });
  return result;
};

describe('check plagiarism', () => {
  test('distributes no plagiarism audit among students with no review submission', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await addTestStudents(3);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }
    const plagiarismComment = 'This is definitely a plagiarism. I have copied this text from another student. This is severe academic misconduct.';

    // create a homework and submit solutions for every student
    const homework = await course.addHomework();
    const solutions = await Promise.all(students.map((student) => {
      return homework.addSolution({ userid: student.userid, solutioncomment: plagiarismComment });
    }));

    // run distribution of reviews
    const solutionReviews = await runDistributionOfReviews(homework, solutions);
    for (const reviews of solutionReviews.toReceive) {
      expect(reviews).toHaveLength(1);
    }

    await runDistributionOfAudits(homework, solutions);

    // because no reviews were created, audits are created
    for (const solution of solutions) {
      const audits = await solution.getAudits();
      const reviews = await solution.getReviews();

      expect(audits).toHaveLength(0);

      // we expect two system reviews because a) plagiarism b) no review submission and a student review
      expect(reviews).toHaveLength(3);
      expect(reviews.filter((r) => r.issystemreview && r.issubmitted)).toHaveLength(1);
      expect(reviews.filter((r) => r.issystemreview && !r.issubmitted)).toHaveLength(1);
    }
  });

  test('distributes plagiarism audits among students', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await addTestStudents(3);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }
    const plagiarismComment = 'This is definitely a plagiarism. I have copied this text from another student. This is severe academic misconduct.';

    // create a homework and submit solutions for every student
    const homework = await course.addHomework();
    const solutions = await Promise.all(students.map((student) => {
      return homework.addSolution({ userid: student.userid, solutioncomment: plagiarismComment });
    }));

    // run distribution of reviews
    const solutionReviews = await runDistributionOfReviews(homework, solutions);
    for (const reviews of solutionReviews.toReceive) {
      expect(reviews).toHaveLength(1);
      await reviews[0].submit();
    }

    await runDistributionOfAudits(homework, solutions);

    // because no reviews were created, audits are created
    for (const solution of solutions) {
      const audits = await solution.getAudits();
      const reviews = await solution.getReviews();

      expect(audits).toHaveLength(1);
      expect(audits[0].reason).toBe(AUDIT_REASON_PLAGIARISM);

      // we expect one system review because of plagiarism and a student review
      expect(reviews).toHaveLength(2);
      expect(reviews.filter((r) => r.issystemreview && !r.issubmitted)).toHaveLength(1);
    }
  });

  test('check plagiarism for files', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await addTestStudents(5);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework();
    const solutions = await Promise.all(students.map((student) => {
      return homework.addSolution({ userid: student.userid });
    }));
    // run the plagiarism check. indices 0, 2 and 4 should be duplicates
    const checking = createChecking(solutions);
    ['samehash', 'differenthash', 'samehash', 'anotherdifferenthash', 'samehash'].forEach((hash, i) => {
      checking[i].hash = hash;
    });
    checking.distances = getMatchesForSolutionSimilarities(solutions, findSimilarities(checking));
    checking.duplicates = getMatchesForSolutionSimilarities(solutions, findDuplicates(checking));

    const result = checking;
    const expectedDuplicates = [checking[0].solutionId, checking[2].solutionId, checking[4].solutionId];

    // check whether the duplicates are detected accordingly
    expect(result.duplicates[expectedDuplicates[0]]).toContain(expectedDuplicates[1]);
    expect(result.duplicates[expectedDuplicates[0]]).toContain(expectedDuplicates[2]);
    expect(result.duplicates[expectedDuplicates[1]]).toContain(expectedDuplicates[0]);
    expect(result.duplicates[expectedDuplicates[1]]).toContain(expectedDuplicates[2]);
    expect(result.duplicates[expectedDuplicates[2]]).toContain(expectedDuplicates[0]);
    expect(result.duplicates[expectedDuplicates[2]]).toContain(expectedDuplicates[1]);
    expect(result.distances).toStrictEqual({});
  });

  test('check plagiarism for text similarity', async () => {
    const course = await addTestCourse();
    const students = await addTestStudents(5);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework();
    const plagiarismComment = 'This is definitely a plagiarism. I have copied this text from another student. This is severe academic misconduct.';
    const solutioncomments = [plagiarismComment, 'No plag Here. I have written this text completely by myself', `${plagiarismComment} - minor differences`, 'just a text', `${plagiarismComment}version 2`];
    const solutions = await Promise.all(students.map((student, index) => {
      return homework.addSolution({ userid: student.userid, solutionfile: [null], solutioncomment: solutioncomments[index] });
    }));

    // run the plagiarism check. indices 0, 2 and 4 should be similar
    const checking = createChecking(solutions);

    checking.duplicates = getMatchesForSolutionSimilarities(solutions, findDuplicates(checking));
    checking.solutionsAboveSimThreshold = getMatchesForSolutionSimilarities(solutions, findSimilarities(checking));

    const result = checking;
    const expectedSimilars = [checking[0].solutionId, checking[2].solutionId, checking[4].solutionId];

    // check whether the similarities are detected accordingly
    expect(result.solutionsAboveSimThreshold[expectedSimilars[0]]).toContain(expectedSimilars[1]);
    expect(result.solutionsAboveSimThreshold[expectedSimilars[0]]).toContain(expectedSimilars[2]);
    expect(result.solutionsAboveSimThreshold[expectedSimilars[1]]).toContain(expectedSimilars[0]);
    expect(result.solutionsAboveSimThreshold[expectedSimilars[1]]).toContain(expectedSimilars[2]);
    expect(result.solutionsAboveSimThreshold[expectedSimilars[2]]).toContain(expectedSimilars[0]);
    expect(result.solutionsAboveSimThreshold[expectedSimilars[2]]).toContain(expectedSimilars[1]);
    expect(result.duplicates).toStrictEqual({});
  });

  test('check plagiarism if both files and text exist', async () => {
    const course = await addTestCourse();
    const students = await addTestStudents(5);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }

    // create a homework and submit solutions for every student
    const homework = await course.addHomework();
    const plagiarismComment = 'This is definitely a plagiarism. I have copied this text from another student. This is severe academic misconduct.';
    const solutioncomments = [plagiarismComment, 'No plag Here. I have written this text completely by myself', `${plagiarismComment} - minor differences`, 'just a text', `${plagiarismComment}version 2`];
    const solutions = await Promise.all(students.map((student, index) => {
      return homework.addSolution({ userid: student.userid, solutionfile: [null], solutioncomment: solutioncomments[index] });
    }));

    // run the plagiarism check. indices 0, 2 and 4 should be similar
    const checking = createChecking(solutions);
    ['null', 'samehash', 'differenthash', 'samehash', 'anotherdifferenthash'].forEach((hash, i) => {
      checking[i].hash = hash;
    });

    const duplicates = getMatchesForSolutionSimilarities(solutions, findDuplicates(checking));
    const solutionsAboveSimThreshold = getMatchesForSolutionSimilarities(solutions, findSimilarities(checking));

    const expectedDuplicates = [checking[1].solutionId, checking[3].solutionId];
    const expectedSimilars = [checking[0].solutionId, checking[2].solutionId, checking[4].solutionId];

    // check whether the duplicates are detected accordingly
    expect(duplicates[expectedDuplicates[0]]).toContain(expectedDuplicates[1]);
    expect(duplicates[expectedDuplicates[1]]).toContain(expectedDuplicates[0]);

    // check whether the similarities are detected accordingly
    expect(solutionsAboveSimThreshold[expectedSimilars[0]]).toContain(expectedSimilars[1]);
    expect(solutionsAboveSimThreshold[expectedSimilars[0]]).toContain(expectedSimilars[2]);
    expect(solutionsAboveSimThreshold[expectedSimilars[1]]).toContain(expectedSimilars[0]);
    expect(solutionsAboveSimThreshold[expectedSimilars[1]]).toContain(expectedSimilars[2]);
    expect(solutionsAboveSimThreshold[expectedSimilars[2]]).toContain(expectedSimilars[0]);
    expect(solutionsAboveSimThreshold[expectedSimilars[2]]).toContain(expectedSimilars[1]);
  });
});
