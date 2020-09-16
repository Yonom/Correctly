/* Ionic imports */
import { IonContent } from '@ionic/react';

import React from 'react';

/* Custom components */
import { useRouter } from 'next/router';
import AppPage from '../components/AppPage';
import Tasks from '../components/home/Tasks';
import CourseModule from '../components/home/CourseModul';
import Overview from '../components/home/Overview';
import { useMyData } from '../services/auth';
/* authentification functions */

/* services */
import { GetCoursesOfUser, GetHomeworksOfUser } from '../services/users';
import { GetSolution } from '../services/solution';

/* utils */
import { isLecturer, isStudent } from '../utils/auth/role';

const HomePage = () => {
  const homeworklistDo = [];
  const homeworklistCorrect = [];
  const taskTitles = [];
  const courses = [];

  const router = useRouter();
  const { userId } = router.query;

  const { data: coursesOfUser, error: coursesError } = GetCoursesOfUser(userId);
  const { data: homeworksOfUser, error: homeworksError } = GetHomeworksOfUser(userId);

  /**
   *
   */
  function studentdata() {
    taskTitles.push('To Do', 'To Correct');
    // Laden der Hausaufgaben zu erledigen

    for (let i = 0; i < homeworksOfUser.ids.length; i++) {
      const { data: solution, error: solutionError } = GetSolution(userId, homeworksOfUser.ids[0]);
      if (solutionError != null) {
        const homework = { course: homeworksOfUser.titles[i], yearcode: homeworksOfUser.yearcodes[i], name: homeworksOfUser.names[i], doingstart: homeworksOfUser.doingstarts[i], doingend: homeworksOfUser.doingends[i], correctingstart: homeworksOfUser.correctingstarts[i], correctingend: homeworksOfUser.correctingends[i] };
        homeworklistDo.push(homework);
      }
    }

    // Laden der Hausaufgaben zu korrigieren

    // Laden der Kurse die besucht werden

    for (let i = 0; i < coursesOfUser.titles.length; i++) {
      const course = { name: coursesOfUser?.titles[i], id: coursesOfUser.ids[i] };
      courses.push(course);
    }
  }

  /**
   *
   */
  function teacherdata() {
    taskTitles.push('Open Homeworks', 'Corrections');
    // Laden der Hausaufgaben offen

    // Laden der Hausaufgaben zu überprüfende

    // Laden der Kurse, die gehalten werden
  }

  const { data: user } = useMyData();

  const role = user?.role;

  if (isStudent(role)) {
    studentdata();
  } else if (isLecturer(role)) {
    teacherdata();
  }

  const pageContent = [];

  /**
   *
   */
  function pageContentLoad() {
    /* create task components */
    const tasks = [];
    const taskDo = <Tasks title={taskTitles[0]} homeworklist={homeworklistDo} />;
    const taskCorrect = <Tasks title={taskTitles[1]} homeworklist={homeworklistCorrect} />;

    tasks.push(taskDo, taskCorrect);

    const overviewTasks = <Overview title="Übersicht" content={tasks} />;

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

  /* check if logged in and get user role {student/ professor} */

  return (
    <AppPage title="home" footer="Correctly">
      <IonContent>
        {pageContentLoad()}
        <div className="">
          {pageContent}
        </div>
      </IonContent>
    </AppPage>
  );
};
export default HomePage;
