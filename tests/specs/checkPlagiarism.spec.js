import addTestCourse from '../models/Course';
import { createTestStudents } from '../utils/helpers';
import { createChecking, findDuplicates, findSimilarities } from '../../src/utils/plagiarismCheck/check';

describe('check plagiarism', () => {
  test('check plagiarism for files', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await createTestStudents(5);
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
    const students = await createTestStudents(5);
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
    const students = await createTestStudents(5);
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
