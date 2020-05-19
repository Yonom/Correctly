/* Ionic imports */
import { IonContent } from '@ionic/react';

import React from 'react';
import Link from 'next/link';

/* Custom components */
import AppPage from '../components/AppPage';
import Tasks from '../components/home/Tasks';
import CourseModule from '../components/home/CourseModul';
import Overview from '../components/home/Overview';

/* authentification functions */


/* utils */


export default () => {
  const pageContent = [];


  /* if student */
  /**
   *
   */
  function studentLoad() {
    /* create Tasklists with Tasks Component */
    const tasks = [];

    /* create assignment objects */
    const assignmentlistD = [];
    const assignmentlistC = [];

    const assignment = { type: 'Case Study', course: 'Data Science', deadline: '20.12.2020', id: 'x' };
    const assignment2 = { type: 'Case Study', course: 'Data Science', deadline: '20.12.2020', id: 'x' };

    /* create assignment objectlists */
    assignmentlistD.push(assignment, assignment2);
    assignmentlistC.push(assignment);

    /* create task components */
    const task1 = <Tasks title="Offene Hausaufgaben" assignmentlist={assignmentlistD} />;
    const task2 = <Tasks title="Offene Korrekturen" assignmentlist={assignmentlistC} />;

    tasks.push(task1, task2);

    /* define column witdths */
    const übersichtWidth = 6;
    const übersichtWidthMobile = 12;

    const overviewTasks = <Overview title="Übersicht" content={tasks} width={übersichtWidth} widthMobile={übersichtWidthMobile} />;

    /* Push Tasklists to PageContent */
    pageContent.push(overviewTasks);


    /* create courses with coursemodel component */
    const coursemodules = [];

    /* create course object */
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
  }
  /* if teacher */
  /**
   *
   */
  function teacherLoad() {
    /* create Tasklists with Tasks Component */
    const tasks = [];
    /* create assignment objects */
    const assignmentlistD = [];
    const assignmentlistC = [];

    const assignment = { type: 'Case Study', course: 'Data Science', deadline: '20.12.2020', id: 'x' };
    const assignment2 = { type: 'Case Study', course: 'Data Science', deadline: '20.12.2020', id: 'x' };

    /* create assignment objectlists */
    assignmentlistD.push(assignment, assignment2);
    assignmentlistC.push(assignment);

    /* create task components */
    const task1 = <Tasks title="Laufende Hausaufgaben" assignmentlist={assignmentlistD} />;
    const task2 = <Tasks title="Zu überprüfende Korrekturen" assignmentlist={assignmentlistC} />;

    tasks.push(task1, task2);

    /* define witdths */
    const übersichtWidth = 6;
    const übersichtWidthMobile = 12;

    const overviewTasks = <Overview title="Übersicht" content={tasks} width={übersichtWidth} widthMobile={übersichtWidthMobile} />;

    /* Push Tasklists to PageContent */
    pageContent.push(overviewTasks);


    /* create courses with coursemodel component */
    const coursemodules = [];

    /* create course object */
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
  }
  /* if superuser */
  /**
   *
   */
  function superuserLoad() {
    /* create all Assignment overview  */
    const assignments = [];

    const createAssignment = <Link href="/"><a style={{ color: '#72993E' }}>Hausaufgaben hinzufügen</a></Link>;
    const editAssingment = <Link href="/"><a style={{ color: '#72993E' }}>Hausaufgaben bearbeiten</a></Link>;

    assignments.push(createAssignment, editAssingment);

    const assignmentWidth = 12;
    const assignmentWidthMobile = 12;

    /* create all Users overview  */
    const users = [];

    const createUser = <Link href="/"><a style={{ color: '#72993E' }}>Nutzer hinzufügen</a></Link>;
    const editUser = <Link href="/"><a style={{ color: '#72993E' }}>Nutzer bearbeiten</a></Link>;

    users.push(createUser, editUser);

    const userWidth = 12;
    const userWidthMobile = 12;

    /* create courses with coursemodel component */
    const coursemodules = [];
    /* create course object */
    const course = { name: 'Analytics', id: '17221' };
    const course2 = { name: 'Big Data', id: '17221' };

    const coursecomp1 = <CourseModule course={course} />;
    const coursecomp2 = <CourseModule course={course2} />;

    coursemodules.push(coursecomp1, coursecomp2, coursecomp1, coursecomp2, coursecomp1);

    const kurseWidth = 3;
    const kurseWidthMobile = 12;

    /* push components to content */
    pageContent.push(
      <Overview title="Alle Hausaufgaben" content={assignments} width={assignmentWidth} widthMobile={assignmentWidthMobile} />,
      <Overview title="Alle Nutzer" content={users} width={userWidth} widthMobile={userWidthMobile} />,
      <Overview title="Alle Kurse" content={coursemodules} width={kurseWidth} widthMobile={kurseWidthMobile} />,
    );
  }


  /* check if logged in and get user role {student/ professor /superuser} */


  return (
    <AppPage title="home" footer="Correctly">
      <IonContent>
        {studentLoad()}
        {pageContent}
      </IonContent>
    </AppPage>
  );
};
