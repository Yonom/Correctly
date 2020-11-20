import moment from 'moment';
import addTestCourse from '../models/Course';
import { createTestStudents, runDistribution } from '../utils/helpers';

describe('distribution of reviews', () => {
  test('distributes reviews among students', async () => {
    const students = await createTestStudents(3);
    const course = await addTestCourse();
    const homework = await course.addHomework();

    const solutions = [];
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
      const solution = await homework.addSolution({ userid: student.userid });
      solutions.push(solution);
    }

    await homework.set({
      solutionstart: moment(),
      solutionend: moment(),
      reviewstart: moment(),
    });

    const result1 = await runDistribution();

    expect(result1).toStrictEqual({});
    for (const solution of solutions) {
      const reviews = await solution.getReviews();
      expect(reviews).toHaveLength(1);
    }
  });
});
