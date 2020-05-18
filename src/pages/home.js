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
  /* check if logged in and get user role {student/ professor /superuser} */


  /* if student */

  /* create Tasklists with Tasks Component */
  const tasks = [<Tasks title="Offene Hausaufgaben" type="Case Study" course="Data Science" deadline="20.12.2020" />,
    <Tasks title="Offene Korrekturen" type="Case Study" course="Data Science" deadline="20.12.2020" />];
  const übersichtWidth = 6;

  /* create courses with coursemodel component */
  const coursemodules = [<CourseModule name="Big Data" id="17221" />,
    <CourseModule name="Analytics" id="17221" />,
    <CourseModule name="Analytics" id="17221" />,
    <CourseModule name="Analytics" id="17221" />,
    <CourseModule name="Analytics" id="17221" />,
  ];
  const kurseWidth = 4;


  /* if teacher */

  /* if superuser */

  return (
    <AppPage title="home" footer="Correctly">
      <IonContent>
        <Overview title="Übersicht" content={tasks} width={übersichtWidth} />
        <Overview title="Kurse" content={coursemodules} width={kurseWidth} />
      </IonContent>
    </AppPage>
  );
};
