/* Ionic imports */
import { IonContent } from '@ionic/react';

import React from 'react';

/* Custom components */
import AppPage from '../components/AppPage';
import Tasks from '../components/home/Tasks';
import CourseModule from '../components/home/CourseModul';
import Overview from '../components/home/Overview';

/* authentification functions */


/* utils */


export default () => {
  const pageContent = [];

  const user = { Role: 'student' };


  /* if student */
  /**
   *
   */
  function studentLoad() {
    /* create Tasklists with Tasks Component */

    /* create assignment objects */
    const assignment = { type: 'Case Study', course: 'Data Science', deadline: '20.12.2020', id: 'x' };
    const assignment2 = { type: 'Case Study', course: 'Data Science', deadline: '20.12.2020', id: 'x' };

    /* create assignment objectlists */
    const assignmentlistD = [assignment, assignment2];
    const assignmentlistC = [assignment];

    /* create task components */
    const tasks = [<Tasks title="Offene Hausaufgaben" assignmentlist={assignmentlistD} />,
      <Tasks title="Offene Korrekturen" assignmentlist={assignmentlistC} />];

    /* define witdths */
    const übersichtWidth = 6;
    const übersichtWdithMobile = 12;


    /* create courses with coursemodel component */

    /* create course object */
    const course = { name: 'Analytics', id: '17221' };
    const course2 = { name: 'Big Data', id: '17221' };

    const coursemodules = [<CourseModule course={course} />,
      <CourseModule course={course} />,
      <CourseModule course={course2} />,
      <CourseModule course={course2} />,
      <CourseModule course={course} />,
    ];
    const kurseWidth = 4;
    const kurseWdithMobile = 6;

    /* push components to content */
    pageContent.push(
      <Overview title="Übersicht" content={tasks} width={übersichtWidth} widthMobile={übersichtWdithMobile} />,
      <Overview title="Kurse" content={coursemodules} width={kurseWidth} widthMobile={kurseWdithMobile} />,
    );
  }
  /* if teacher */
  /**
   *
   */
  function teacherLoad() {
    /* create Tasklists with Tasks Component */

    /* create assignment objects */
    const assignment = { type: 'Case Study', course: 'Data Science', deadline: '20.12.2020', id: 'x' };
    const assignment2 = { type: 'Case Study', course: 'Data Science', deadline: '20.12.2020', id: 'x' };

    /* create assignment objectlists */
    const assignmentlistD = [assignment, assignment2];
    const assignmentlistC = [assignment];

    /* create task components */
    const tasks = [<Tasks title="Laufende Hausaufgaben" assignmentlist={assignmentlistD} />,
      <Tasks title="Zu überprüfende Korrekturen" assignmentlist={assignmentlistC} />];

    /* define witdths */
    const übersichtWidth = 6;
    const übersichtWdithMobile = 12;


    /* create courses with coursemodel component */

    /* create course object */
    const course = { name: 'Analytics', id: '17221' };
    const course2 = { name: 'Big Data', id: '17221' };

    const coursemodules = [<CourseModule course={course} />,
      <CourseModule course={course} />,
      <CourseModule course={course2} />,
      <CourseModule course={course2} />,
      <CourseModule course={course} />,
    ];
    const kurseWidth = 4;
    const kurseWdithMobile = 6;

    /* push components to content */
    pageContent.push(
      <Overview title="Übersicht" content={tasks} width={übersichtWidth} widthMobile={übersichtWdithMobile} />,
      <Overview title="Kurse" content={coursemodules} width={kurseWidth} widthMobile={kurseWdithMobile} />,
    );
  }
  /* if superuser */
  /**
   *
   */
  function superuserLoad() {

  }


  /* check if logged in and get user role {student/ professor /superuser} */


  return (
    <AppPage title="home" footer="Correctly">
      <IonContent>
        {teacherLoad()}
        {pageContent}
      </IonContent>
    </AppPage>
  );
};
