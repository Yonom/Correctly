/* eslint-disable jest/no-conditional-expect */
import { resolveAudit } from '../../src/services/audits';
import { homeworksPublishGrades } from '../../src/services/homeworks';
import { addLecturerReview, changeReview } from '../../src/services/reviews';
import { addSolution } from '../../src/services/solutions';
import { addTestCourse } from '../models/Course';
import { addTestLecturer } from '../models/User';
import { addTestStudents, getMyCourses, getMyHomeworks, getCourse, getHomework, getSolution, runDistributionOfReviews, getMyReviews, getHasAudit, showReview, runDistributionOfAudits, getMyAudits, getReview } from '../utils/helpers';
import setLogin from '../utils/setLogin';

describe('smoke test', () => {
  test('scenario', async () => {
    // create course with three students
    const course = await addTestCourse();
    const students = await addTestStudents(3);
    for (const student of students) {
      await course.addAttendee({ userid: student.userid, isstudent: true });
    }
    const lecturer = await addTestLecturer();
    await course.addAttendee({ userid: lecturer.userid, islecturer: true });

    const homework = await course.addHomework({ samplesize: 3 });

    {
      await setLogin(lecturer);
      const myCourses = await getMyCourses();
      expect(myCourses).toHaveLength(1);

      const myCourse = myCourses[0];
      expect(myCourse.id).toBe(course.id);

      const myCourseObj = await getCourse(myCourse.id);
      expect(myCourseObj.id).toBe(myCourse.id);

      const { homeworks, attendees } = myCourseObj;
      expect(attendees).toHaveLength(4);
      for (const attendee of attendees) {
        if (attendee.islecturer) {
          expect(attendee.userid).toBe(lecturer.userid);
        } else {
          expect(attendee.isstudent).toBe(true);
        }
      }

      expect(homeworks).toHaveLength(1);
      expect(homeworks[0].id).toBe(homework.id);

      const myHomework = await getHomework(homeworks[0].id);
      expect(myHomework.solutions).toHaveLength(0);
      expect(myHomework.usersWithoutSolution).toHaveLength(3);
    }

    for (const student of students) {
      await setLogin(student);

      // load the home page and look at courses section
      const myCourses = await getMyCourses();
      expect(myCourses).toHaveLength(1);

      const myCourse = myCourses[0];
      expect(myCourse.id).toBe(course.id);

      // go to view course page and look at attendees and homeworks
      const myCourseObj = await getCourse(myCourse.id);
      expect(myCourseObj.id).toBe(myCourse.id);

      const { homeworks, attendees } = myCourseObj;
      expect(attendees).toHaveLength(4);
      for (const attendee of attendees) {
        if (attendee.islecturer) {
          expect(attendee.userid).toBe(lecturer.userid);
        } else {
          expect(attendee.isstudent).toBe(true);
        }
      }

      expect(homeworks).toHaveLength(1);
      expect(homeworks[0].id).toBe(homework.id);

      // go to view homework page and verify that the student has one open solution
      const myHomework = await getHomework(homeworks[0].id);
      expect(myHomework.solutions).toHaveLength(0);
      expect(myHomework.usersWithoutSolution).toHaveLength(1);

      // go to home page and look at open homeworks
      const openHomeworks = await getMyHomeworks();
      expect(openHomeworks).toHaveLength(1);

      const openHomework = openHomeworks[0];
      expect(openHomework.id).toBe(homework.id);

      const submissionResult = await addSolution(openHomework.id, null, null, `Solution of ${student.userid}`);
      expect(submissionResult).toStrictEqual({});

      const openHomeworksAfter = await getMyHomeworks();
      expect(openHomeworksAfter).toHaveLength(0);

      // check if user can see their solution on the view homework page
      const myHomeworkAfter = await getHomework(homeworks[0].id);
      expect(myHomeworkAfter.solutions).toHaveLength(1);
      expect(myHomeworkAfter.usersWithoutSolution).toHaveLength(0);

      // open view solution page and see if the solution was properly uploaded
      const solution = myHomeworkAfter.solutions[0];
      const mySolution = await getSolution(homework.id, solution.userid);
      expect(mySolution.solution.id).toBe(solution.id);
      expect(mySolution.solution.solutioncomment).toBe(`Solution of ${solution.userid}`);
      expect(mySolution.solution.percentagegrade).toBeNull();
      expect(mySolution.reviews).toHaveLength(0);
    }

    // lecturer verifies that they can view the solutions
    {
      await setLogin(lecturer);
      const myHomework = await getHomework(homework.id);
      expect(myHomework.solutions).toHaveLength(3);
      expect(myHomework.usersWithoutSolution).toHaveLength(0);

      for (const solution of myHomework.solutions) {
        const mySolution = await getSolution(homework.id, solution.userid);
        expect(mySolution.solution.id).toBe(solution.id);
        expect(mySolution.solution.percentagegrade).toBeNull();
        expect(mySolution.solution.solutioncomment).toBe(`Solution of ${solution.userid}`);
        expect(mySolution.reviews).toHaveLength(0);
      }
    }

    // distribute reviews
    await setLogin(undefined);
    await runDistributionOfReviews(homework);

    // verify that the lecturer can see the distributed reviews
    {
      await setLogin(lecturer);
      const myHomework = await getHomework(homework.id);
      expect(myHomework.solutions).toHaveLength(3);
      expect(myHomework.usersWithoutSolution).toHaveLength(0);

      for (const solution of myHomework.solutions) {
        // dummy review
        await addLecturerReview(solution.id);

        const reviews = await getMyReviews();
        expect(reviews).toHaveLength(0);

        const mySolution = await getSolution(homework.id, solution.userid);
        expect(mySolution.reviews).toHaveLength(1);
      }
    }

    for (const student of students) {
      await setLogin(student);

      // load the home page and look at courses section
      const myCourses = await getMyCourses();
      expect(myCourses).toHaveLength(1);

      const myCourse = myCourses[0];
      expect(myCourse.id).toBe(course.id);

      // go to view course page and look at attendees and homeworks
      const myCourseObj = await getCourse(myCourse.id);
      expect(myCourseObj.id).toBe(myCourse.id);

      const { homeworks } = myCourseObj;
      expect(homeworks).toHaveLength(1);
      expect(homeworks[0].id).toBe(homework.id);

      // go to view homework page and verify that the student has one open solution
      const myHomework = await getHomework(homeworks[0].id);
      expect(myHomework.solutions).toHaveLength(1);

      const solution = myHomework.solutions[0];
      const mySolution = await getSolution(homework.id, solution.userid);
      expect(mySolution.reviews).toHaveLength(0);

      // go to home page and look at open homeworks
      const openReviews = await getMyReviews();
      expect(openReviews).toHaveLength(1);

      const openReview = openReviews[0];

      // load the review
      const review = await getReview(openReview.id);
      expect(review.id).toBe(openReview.id);

      const submissionResult = await changeReview(openReview.id, 50, null, null, `Review of ${student.userid}`);
      expect(submissionResult).toStrictEqual({});

      const openReviewsAfter = await getMyReviews();
      expect(openReviewsAfter).toHaveLength(0);

      // verify that the user can not see their review on the view homework page
      const mySolutionAfter = await getSolution(homework.id, solution.userid);
      expect(mySolutionAfter.solution.id).toBe(solution.id);
      expect(mySolutionAfter.solution.percentagegrade).toBeNull();
      expect(mySolutionAfter.reviews).toHaveLength(0);
    }

    {
      await setLogin(lecturer);
      const myHomework = await getHomework(homework.id);
      expect(myHomework.solutions).toHaveLength(3);
      expect(myHomework.usersWithoutSolution).toHaveLength(0);

      for (const solution of myHomework.solutions) {
        const mySolution = await getSolution(homework.id, solution.userid);
        expect(mySolution.solution.id).toBe(solution.id);
        expect(mySolution.solution.percentagegrade).toBe(50);
        expect(mySolution.reviews).toHaveLength(1);

        const review = mySolution.reviews[0];
        expect(review.islecturerreview || review.issystemreview).toBe(false);
        const myReview = await showReview(review.reviewid);
        expect(myReview.id).toBe(review.reviewid);
        expect(myReview.reviewcomment).toBe(`Review of ${myReview.userid}`);
      }
    }

    // distribute audits
    await setLogin(undefined);
    await runDistributionOfAudits(homework);

    {
      await setLogin(lecturer);
      const audits = await getMyAudits();
      expect(audits).toHaveLength(3);

      const myHomework = await getHomework(homework.id);
      expect(myHomework.solutions).toHaveLength(3);
      expect(myHomework.usersWithoutSolution).toHaveLength(0);

      for (const solution of myHomework.solutions) {
        // handle audit
        expect(solution.hasunresolvedaudit).toBe(true);
        const { hasaudit } = await getHasAudit(solution.id);
        expect(hasaudit).toBe(true);
        await resolveAudit(solution.id);
        const { hasaudit: hasauditAfter } = await getHasAudit(solution.id);
        expect(hasauditAfter).toBe(false);

        // create a lecturer review
        const lecturerReview = await addLecturerReview(solution.id);
        const submissionResult = await changeReview(lecturerReview.id, 100, null, null, `Review of ${lecturer.userid}`);
        expect(submissionResult).toStrictEqual({});

        // verify the grade has been updated
        const mySolution = await getSolution(homework.id, solution.userid);
        expect(mySolution.solution.id).toBe(solution.id);
        expect(mySolution.solution.percentagegrade).toBe(100);
        expect(mySolution.reviews).toHaveLength(2);
        for (const review of mySolution.reviews) {
          expect(review.issystemreview).toBe(false);
          const myReview = await showReview(review.reviewid);
          expect(myReview.id).toBe(review.reviewid);
          expect(myReview.issubmitted).toBe(true);
          expect(myReview.reviewcomment).toBe(`Review of ${myReview.userid}`);
        }
      }

      await homeworksPublishGrades(homework.id);
    }

    for (const student of students) {
      await setLogin(student);

      // go to view homework page and verify that the student has one open solution
      const myHomework = await getHomework(homework.id);
      expect(myHomework.solutions).toHaveLength(1);

      const solution = myHomework.solutions[0];
      expect(solution.percentagegrade).toBe(100);

      const mySolution = await getSolution(homework.id, solution.userid);
      expect(mySolution.reviews).toHaveLength(2);
      expect(mySolution.solution.id).toBe(solution.id);
      expect(mySolution.solution.percentagegrade).toBe(100);
    }
  }, 120000);
});
