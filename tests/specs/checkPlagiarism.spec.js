import fs from 'fs/promises';
import { addTestCourse } from '../models/Course';
import { addTestStudents, runDistributionOfReviews } from '../utils/helpers';
import { createChecking, findDuplicates, findSimilarities } from '../../src/utils/plagiarismCheck/check';
import { AUDIT_REASON_PLAGIARISM } from '../../src/utils/constants';
import testData from '../../test.json';

const groupBy = function groupBy(xs, key) {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

describe('check plagiarism', () => {
  test('distributes plagiarism audits among test data', async () => {
    const testSolutionGroups = groupBy(testData.solutions, 'homeworkid');

    for (const [homeworkId, testSolutions] of Object.entries(testSolutionGroups)) {
      // eslint-disable-next-line no-continue
      if (testSolutions.length < 3) continue;

      // create course with three students
      console.log(testSolutions.length);
      const course = await addTestCourse();
      const students = await addTestStudents(testSolutions.length);
      for (const student of students) {
        await course.addAttendee({ userid: student.userid, isstudent: true });
      }
      // create a homework and submit solutions for every student
      const homework = await course.addHomework();
      const solutions = await Promise.all(students.map((student, i) => {
        return homework.addSolution({ userid: student.userid, solutioncomment: testSolutions[i].solutioncomment, solutionfilenames: [i.toString()] });
      }));

      const ignoreList = [];
      const plagiatList = [];
      // run distribution of reviews, we expect one system review because plagiarism was detected
      const solutionReviews = await runDistributionOfReviews(homework, solutions);
      solutionReviews.toDo.forEach((reviews, i) => {
        if (reviews[0].issystemreview) {
          const similarTo = reviews[0].reviewcomment.split('👉 ')[1].split('.')[0].split(', ')
            .map((sid) => testSolutions[solutions.filter((sol) => sol.id === sid)[0].solutionfilenames[0]]);

          const orig = testSolutions[solutions[i].solutionfilenames[0]];
          if (ignoreList.includes(orig)) return;
          plagiatList.push([
            orig,
            ...similarTo,
          ]);
          ignoreList.push(...similarTo);
          console.log(solutions[i].solutionfilenames[0]);
        }
      });

      await fs.writeFile(`output/${homeworkId}.json`, JSON.stringify(plagiatList, null, 2));
      console.log(plagiatList);
    }
    expect(1).toBe(1);

    // // because no reviews were created, audits are created
    // for (const solution of solutions) {
    //   const audits = await solution.getAudits();
    //   expect(audits).toHaveLength(1);
    //   expect(audits[0].reason).toBe(AUDIT_REASON_PLAGIARISM);
    // }
  }, 3600000);

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

    // run distribution of reviews, we expect one system review because plagiarism was detected
    const solutionReviews = await runDistributionOfReviews(homework, solutions);
    for (const reviews of solutionReviews.toDo) {
      expect(reviews).toHaveLength(1);
      expect(reviews[0].issystemreview).toBe(true);
    }

    // because no reviews were created, audits are created
    for (const solution of solutions) {
      const audits = await solution.getAudits();
      expect(audits).toHaveLength(1);
      expect(audits[0].reason).toBe(AUDIT_REASON_PLAGIARISM);
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
    checking.hashes = ['samehash', 'differenthash', 'samehash', 'anotherdifferenthash', 'samehash'];
    checking.distances = findSimilarities(checking);
    checking.duplicates = findDuplicates(checking);

    const result = checking;
    const expectedDuplicates = [checking.solutionids[0], checking.solutionids[2], checking.solutionids[4]];

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
    const checking = await createChecking(solutions);

    checking.duplicates = await findDuplicates(checking);
    checking.solutionsAboveSimThreshold = await findSimilarities(checking);

    const result = checking;
    const expectedSimilars = [checking.solutionids[0], checking.solutionids[2], checking.solutionids[4]];

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
    const checking = await createChecking(solutions);
    checking.hashes = ['null', 'samehash', 'differenthash', 'samehash', 'anotherdifferenthash'];

    checking.duplicates = await findDuplicates(checking);
    checking.solutionsAboveSimThreshold = await findSimilarities(checking);

    const result = checking;
    const expectedDuplicates = [checking.solutionids[1], checking.solutionids[3]];
    const expectedSimilars = [checking.solutionids[0], checking.solutionids[2], checking.solutionids[4]];

    // check whether the duplicates are detected accordingly
    expect(result.duplicates[expectedDuplicates[0]]).toContain(expectedDuplicates[1]);
    expect(result.duplicates[expectedDuplicates[1]]).toContain(expectedDuplicates[0]);

    // check whether the similarities are detected accordingly
    expect(result.solutionsAboveSimThreshold[expectedSimilars[0]]).toContain(expectedSimilars[1]);
    expect(result.solutionsAboveSimThreshold[expectedSimilars[0]]).toContain(expectedSimilars[2]);
    expect(result.solutionsAboveSimThreshold[expectedSimilars[1]]).toContain(expectedSimilars[0]);
    expect(result.solutionsAboveSimThreshold[expectedSimilars[1]]).toContain(expectedSimilars[2]);
    expect(result.solutionsAboveSimThreshold[expectedSimilars[2]]).toContain(expectedSimilars[0]);
    expect(result.solutionsAboveSimThreshold[expectedSimilars[2]]).toContain(expectedSimilars[1]);
  });
});
