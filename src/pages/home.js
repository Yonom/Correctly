/* Ionic imports */
import { IonContent, IonHeader, IonTitle, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonItemDivider } from '@ionic/react';

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


  const tasks = [<Tasks title="Offene Hausaufgaben" type="Case Study" course="Data Science" deadline="20.12.2020" />,
    <Tasks title="Offene Korrekturen" type="Case Study" course="Data Science" deadline="20.12.2020" />];
  const coursemodules = [<CourseModule name="Big Data" id="17221" />,
    <CourseModule name="Analytics" id="17221" />,
    <CourseModule name="Analytics" id="17221" />,
    <CourseModule name="Analytics" id="17221" />];


  return (
    <AppPage title="home" footer="Correctly">
      <IonContent>
        <Overview title="Übersicht" content={tasks} />
        <Overview title="Kurs" content={coursemodules} />
      </IonContent>
    </AppPage>
  );
};
