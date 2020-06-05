/* Ionic imports */
import { IonContent } from '@ionic/react';

import React from 'react';
import Link from 'next/link';

/* Custom components */
import AppPage from '../components/AppPage';
import Tasks from '../components/home/Tasks';
import CourseModule from '../components/home/CourseModul';
import Overview from '../components/home/Overview';
import TasksMobile from '../components/home/TasksMobile';
import OverviewList from '../components/home/OverviewList';

/* authentification functions */


/* utils */


export default () => {
  const pageContent = [];
  const pageContentMobile = [];


  /* if student */
  /**
   *
   */
  function studentLoad() {
    /* create Tasklists with Tasks Component */
    const tasks = [];
    const tasksMobile = [];

    /* create assignment objects */
    const assignmentlistD = [];
    const assignmentlistC = [];

    /* get assignments */

    const assignment = { type: 'Case Study', course: 'Data Science', deadline: '20.12.2020', id: 'x' };
    const assignment2 = { type: 'Case Study', course: 'Data Science', deadline: '20.12.2020', id: 'x' };

    /* create assignment objectlists */
    assignmentlistD.push(assignment, assignment2);
    assignmentlistC.push(assignment);

    /* create task components */
    const taskD = <Tasks title="Offene Hausaufgaben" assignmentlist={assignmentlistD} />;
    const taskC = <Tasks title="Offene Korrekturen" assignmentlist={assignmentlistC} />;

    tasks.push(taskD, taskC);

    /* create task components for mobile */
    const tasksMobileD = <TasksMobile title="Offene Hausaufgaben" assignmentlist={assignmentlistD} />;
    const tasksMobileC = <TasksMobile title="Offene Korrekturen" assignmentlist={assignmentlistD} />;

    tasksMobile.push(tasksMobileD, tasksMobileC);

    /* define column witdths */
    const übersichtWidth = 6;

    const overviewTasks = <Overview title="Übersicht" content={tasks} width={übersichtWidth} widthMobile={0} />;
    const overviewTasksMobile = <OverviewList title="Übersicht" content={tasksMobile} />;

    /* Push Tasklists to PageContent */
    pageContent.push(overviewTasks);
    pageContentMobile.push(overviewTasksMobile);


    /* create courses with coursemodel component */
    const coursemodules = [];

    /* get courses */

    /* create course object */
    const course = { name: 'Analytics', id: '17221' };
    const course2 = { name: 'Big Data', id: '17221' };

    const coursecomp1 = <CourseModule course={course} />;
    const coursecomp2 = <CourseModule course={course2} />;

    coursemodules.push(coursecomp1, coursecomp2, coursecomp1, coursecomp2, coursecomp1);

    const kurseWidth = 4;
    const kurseWidthMobile = 12;

    const overviewKurse = <Overview title="Kurse" content={coursemodules} width={kurseWidth} widthMobile={kurseWidthMobile} />;

    /* Push Courses to PageContent(mobile) */
    pageContent.push(overviewKurse);
    pageContentMobile.push(overviewKurse);
  }
  /* if teacher */
  /**
   *
   */
  function teacherLoad() {
    /* create Tasklists with Tasks Component */
    const tasks = [];
    const tasksMobile = [];

    /* create assignment objects */
    const assignmentlistD = [];
    const assignmentlistC = [];

    /* get open assignments  */

    const assignment = { type: 'Case Study', course: 'Data Science', deadline: '20.12.2020', id: 'x' };
    const assignment2 = { type: 'Case Study', course: 'Data Science', deadline: '20.12.2020', id: 'x' };

    /* create assignment objectlists */
    assignmentlistD.push(assignment, assignment2);
    assignmentlistC.push(assignment);

    /* create task components */
    const taskD = <Tasks title="Laufende Hausaufgaben" assignmentlist={assignmentlistD} />;
    const taskC = <Tasks title="Zu überprüfende Korrekturen" assignmentlist={assignmentlistC} />;

    tasks.push(taskD, taskC);

    /* create task components for mobile */
    const tasksMobileD = <TasksMobile title="Laufende Hausaufgaben" assignmentlist={assignmentlistD} />;
    const tasksMobileC = <TasksMobile title="Zu überprüfende Korrekturen" assignmentlist={assignmentlistD} />;

    tasksMobile.push(tasksMobileD, tasksMobileC);

    /* define witdths */
    const übersichtWidth = 6;
    const übersichtWidthMobile = 12;

    const overviewTasks = <Overview title="Übersicht" content={tasks} width={übersichtWidth} widthMobile={übersichtWidthMobile} />;
    const overviewTasksMobile = <OverviewList title="Übersicht" content={tasksMobile} />;

    /* Push Tasklists to PageContent */
    pageContent.push(overviewTasks);
    pageContentMobile.push(overviewTasksMobile);


    /* create courses with coursemodel component */
    const coursemodules = [];

    /* get courses  */

    /* create course objects */

    const course = { name: 'Analytics', id: '17221' };
    const course2 = { name: 'Big Data', id: '17221' };


    const coursecomp1 = <CourseModule course={course} />;
    const coursecomp2 = <CourseModule course={course2} />;

    coursemodules.push(coursecomp1, coursecomp2, coursecomp1, coursecomp2, coursecomp1);

    const kurseWidth = 4;
    const kurseWidthMobile = 12;

    const overviewKurse = <Overview title="Kurse" content={coursemodules} width={kurseWidth} widthMobile={kurseWidthMobile} />;
    /* Push Courses to PageContent */
    pageContent.push(overviewKurse);
    pageContentMobile.push(overviewKurse);
  }


  /* check if logged in and get user role {student/ professor} */


  return (
    <AppPage title="home" footer="Correctly">
      <IonContent>
        {studentLoad()}
        <div className="ion-hide-lg-down">
          {pageContent}
        </div>
        <div className="ion-hide-lg-up">
          {pageContentMobile}
        </div>
      </IonContent>
    </AppPage>
  );
};
