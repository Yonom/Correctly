/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonInput, IonText, IonAlert } from '@ionic/react';


import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import axios from 'axios';

/* Custom components */
import Router from 'next/router';
import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

/* authentification functions */
import { sendPasswordResetEmail } from '../../services/auth';

/* utils */
import { isValidEmail } from '../../utils/isValidEmail';
import { useToaster } from '../../components/GlobalToast';

export default () => {
  const [showAlertFail, setShowAlertFail] = useState(false);
  const sendToast = useToaster();

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
              <IonLabel position="stacked">Kurstitel eingeben <IonText color="danger">*</IonText></IonLabel>
              <IonController type="text" as={IonInput} control={control} name="courseTitle" required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Jahres-Code eingeben <IonText color="danger">*</IonText></IonLabel>
              <IonController type="text" as={IonInput} control={control} name="yearCode" required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Modulkoordinator eingeben </IonLabel>
              <IonController type="text" as={IonInput} control={control} name="moduleCoordinator" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Lehrende eingeben </IonLabel>
              <IonController type="text" as={IonInput} control={control} name="lecturer1" />
            </IonItem>
            <IonItem>
              <IonController type="text" as={IonInput} control={control} name="lecturer2" />
            </IonItem>
            <IonItem>
              <IonController type="text" as={IonInput} control={control} name="lecturer3" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Matrikelnummern der  Studierenden eingeben mit Kommata getrennt</IonLabel>
              <IonController type="text" as={IonInput} control={control} name="students" />
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
