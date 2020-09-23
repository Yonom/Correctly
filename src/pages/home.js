/* Ionic imports */
import { IonContent } from '@ionic/react';

import React from 'react';

/* Custom components */
import AppPage from '../components/AppPage';
import Tasks from '../components/home/Tasks';
import CourseModule from '../components/home/CourseModul';
import Overview from '../components/home/Overview';
import { useMyData } from '../services/auth';

/* authentification functions */

/* services */
import { GetCoursesOfUser, GetHomeworksOfUser, GetReviewsOfUser } from '../services/users';
import { GetSolution } from '../services/solution';

/* utils */
import { isLecturer, isStudent } from '../utils/auth/role';

const HomePage = () => {
  const homeworklistDo = [];
  const reviewlistDo = [];
  const taskTitles = [];
  const courses = [];
  const pageContent = [];
  
  const { data: coursesOfUser, error: coursesError } = GetCoursesOfUser(userId);
  const { data: homeworksOfUser, error: homeworksError } = GetHomeworksOfUser(userId);
  const { data: reviewsOfUser, error: reviewsError } = GetReviewsOfUser(userId);

  const { data: user } = useMyData();
  const loggedIn = user?.loggedIn;

  /**
   *
   */
  function loadpage() {
    /* Load personalized data */
    for (let i = 0; i < homeworksOfUser?.ids.length; i++) {
      const { data: solution, error: solutionError } = GetSolution(userId, homeworksOfUser?.ids[0]);
      if (solutionError != null) {
        const homework = { id: homeworksOfUser?.ids[i], course: homeworksOfUser?.titles[i], yearcode: homeworksOfUser?.yearcodes[i], name: homeworksOfUser?.names[i], doingstart: homeworksOfUser?.doingstarts[i], doingend: homeworksOfUser?.doingends[i] };
        homeworklistDo.push(homework);
      }
    }

    for (let i = 0; i < coursesOfUser?.titles.length; i++) {
      const course = { name: coursesOfUser?.titles[i], id: coursesOfUser.ids[i] };
      courses.push(course);
    }

    /* Load role text */
    if (isStudent(role)) {
      taskTitles.push('Homeworks');
      taskTitles.push('Reviews');

      for (let i = 0; i < reviewsOfUser?.ids.length; i++) {
        const review = { id: reviewsOfUser?.ids[i], homework: reviewsOfUser?.homeworks[i], course: reviewsOfUser?.courses[i], start: reviewsOfUser?.starts[i], end: reviewsOfUser?.ends[i] };
        reviewlistDo.push(review);
      }
    } else if (isLecturer(role)) {
      taskTitles.push('Open homeworks');
      taskTitles.push('Proofreading');
    }

    /* Load components */
    const tasks = [];
    const taskDo = <Tasks title={taskTitles[0]} homeworklist={homeworklistDo} />;
    const taskCorrect = <Tasks title={taskTitles[1]} homeworklist={reviewlistDo} />;

    tasks.push(taskDo, taskCorrect);

    const overviewTasks = <Overview title="To do" content={tasks} />;

    /* Push Tasklists to PageContent */
    pageContent.push(overviewTasks);

    /* create courses with coursemodel component */
    const coursemodules = [];

    /* create course object */
    courses.forEach((course) => {
      coursemodules.push(
        <CourseModule course={course} />,
      );
    });

    const overviewKurse = <Overview title="Courses" content={coursemodules} />;

    /* Push Courses to PageContent(mobile) */
    pageContent.push(overviewKurse);
  }

  return (
    <AppPage title="home" footer="Correctly">
      {loggedIn && (
        loadpage())}
      <div className="">
        {pageContent}
      </div>
    </AppPage>
  );
};
export default HomePage;
