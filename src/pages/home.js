/* Ionic imports */
import { IonContent } from '@ionic/react';

import React from 'react';

/* Custom components */
import { functions } from 'firebase';
import AppPage from '../components/AppPage';
import Tasks from '../components/home/Tasks';
import CourseModule from '../components/home/CourseModul';
import Overview from '../components/home/Overview';
import { useMyData } from '../services/auth';
/* authentification functions */

/* services */
import executeQuery from '../services/api/database/query';

/* utils */
import { isLecturer, isStudent } from '../utils/auth/role';

const HomePage = () => {
  const homeworklistDo = [];
  const homeworklistCorrect = [];
  const taskTitles = [];
  /**
   *
   */
  function studentdata() {
    taskTitles.push('To Do', 'To Correct');
    // Laden der Hausaufgaben zu erledigen
    
    const queryText = 'SELECT homeworkname, id, doinstart, doingend FROM homeworks WHERE requirecorrectingdocumentationfile = TRUE';
    const params = [homeworkname, id, doingstart, doingend];
    homeworklistDo.push(executeQuery(queryText, params));

    const assignment = { type: 'Case Study', course: 'Data Science', deadline: '20.12.2020', id: 'x' };
    const assignment2 = { type: 'Case Study', course: 'Data Science', deadline: '20.12.2020', id: 'x' };

    homeworklistDo.push(assignment, assignment2);

    // Laden der Hausaufgaben zu korrigieren

    homeworklistCorrect.push();
    // Laden der Kurse die besucht werden
    const courses =[];
    const course = { name: 'Analytics', id: '17221' };
    const course2 = { name: 'Big Data', id: '17221' };
    courses.push()
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
        <CourseModule course={course}/>,
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
