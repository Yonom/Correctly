/* Ionic imports */
import { IonContent, IonHeader, IonTitle, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonItemDivider } from '@ionic/react';

import React from 'react';

/* Custom components */
import AppPage from '../components/AppPage';
import Tasks from '../components/home/Tasks';
import CourseModule from '../components/home/CourseModul';

/* authentification functions */


/* utils */


export default () => {
  /* check if logged in and get user role {student/ professor /superuser} */
  return (
    <AppPage title="home" footer="Correctly">
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Übersicht</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <ion-grid>
              <ion-row>
                <ion-col>
                  <Tasks />
                </ion-col>
                <ion-col>
                  <Tasks />
                </ion-col>
              </ion-row>
            </ion-grid>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Kurse</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <ion-grid>
              <ion-row>
                <ion-col>
                  <CourseModule />
                </ion-col>
                <ion-col>
                  <CourseModule />
                </ion-col>
                <ion-col>
                  <CourseModule />
                </ion-col>
              </ion-row>
            </ion-grid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </AppPage>
  );
};
