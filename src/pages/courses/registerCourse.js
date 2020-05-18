/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonInput, IonText, IonAlert, IonSearchbar, IonToolbar, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';


import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import axios from 'axios';

/* Custom components */
import Router from 'next/router';
import { database } from 'firebase';
import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

/* authentification functions */
import { sendPasswordResetEmail } from '../../services/auth';

import styles from './registerCourse.module.css';

export default () => {
  const allUsers = [{
    id: '123',
    name: 'Yannick Aaron',
    email: 'yannick@yannick.de',
  }, {
    id: '1234',
    name: 'Yannick Aaron',
    email: 'yannick@yannick.de',
  }];
  let selectedModuleCoordinator;
  const selectedlecturers = [];
  const selectedStudents = [];

  const [searchTermLecturers, setSearchTermLecturers] = useState('');
  const [searchTermModuleCoordinator, setSearchTermModuleCoordinator] = useState('');
  const [searchTermStudents, setSearchTermStudents] = useState('');


  const testEl = allUsers.filter((u) => u.name.toLowerCase().startsWith(searchTermModuleCoordinator.toLowerCase())).map((u) => {
    return (
      <div style={{ width: '100%' }}>
        <IonItem key={u.id}>
          <IonLabel position="stacked">
            Name

            <IonText color="danger">*</IonText>
          </IonLabel>
          <IonInput required type="text" />
          <IonLabel position="stacked">
            Vorname
            {' '}
            <IonText color="danger">*</IonText>
          </IonLabel>
          <IonInput required type="text" />
        </IonItem>
      </div>
    );
  });

  const handleChangeLecturers = (event) => {
    setSearchTermLecturers(event.target.value);
  };
  const handleChangeModuleCoordinator = (event) => {
    setSearchTermModuleCoordinator(event.target.value);
  };
  const handleChangeStudents = (event) => {
    setSearchTermStudents(event.target.value);
  };


  const [showAlertFail, setShowAlertFail] = useState(false);

  const doCreateCourse = async (data) => {
    try {
      const formdata = {
        courseTitle: data.courseTitle,
        yearCode: data.yearCode,
      };
      const moduleCoordinator = {
        id: data.moduleCoordinator,
        role: 'module coordinator',
      };
      const lecturer1 = {
        id: data.lecturer1,
        role: 'lecturer',
      };
      const lecturer2 = {
        id: data.lecturer1,
        role: 'lecturer',
      };
      const lecturer3 = {
        id: data.lecturer1,
        role: 'lecturer',
      };
      const user1 = {
        id: 9,
        role: 'student',
      };
      formdata.users = [moduleCoordinator, lecturer1, lecturer2, lecturer3, user1];
      const response = await axios.post('../api/courses/registerCourse', { formdata });
    } catch (ex) {
      setShowAlertFail(true);
    }
  };
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    doCreateCourse(data);
  };

  return (
    <AppPage title="Neuen Kurs anlegen" footer="Correctly">
      <IonContent>
        <IonCenterContent innerStyle={{ padding: '10%' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem>
              <IonLabel position="stacked">
                Kurstitel eingeben
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="text" as={IonInput} control={control} name="courseTitle" required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">
                Jahres-Code eingeben
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="text" as={IonInput} control={control} name="yearCode" required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Modulkoordinator eingeben </IonLabel>
              <IonSearchbar placeholder="Filter nach Name" value={searchTermModuleCoordinator} onIonChange={handleChangeModuleCoordinator} />
              <div style={{ width: '100%' }}>
                <IonList>
                  {testEl}
                </IonList>
              </div>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Lehrende eingeben </IonLabel>
              <IonSearchbar placeholder="Filter nach Name" value={searchTermLecturers} onIonChange={handleChangeLecturers} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Matrikelnummern der  Studierenden eingeben mit Kommata getrennt</IonLabel>
              <IonSearchbar placeholder="Filter nach Name" value={searchTermStudents} onIonChange={handleChangeStudents} />
              <IonButton type="button" expand="block" color="success"> Hinzufügen</IonButton>
            </IonItem>
            <div className="ion-padding">
              <IonButton type="submit" expand="block" class="ion-no-margin">Kurs anlegen</IonButton>
            </div>
          </form>
          <section className="ion-padding">
            <Link href="/" passHref>
              <IonButton color="medium" size="default" fill="clear" expand="block" class="ion-no-margin">Zurück zum Menü</IonButton>
            </Link>
          </section>
        </IonCenterContent>
      </IonContent>
    </AppPage>
  );
};
