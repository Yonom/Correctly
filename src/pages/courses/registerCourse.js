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
      const response = await axios.post('../api/courses/registerCourse', { data });
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
          <section>
            <IonAlert
              isOpen={showAlertFail}
              onDidDismiss={() => setShowAlertFail(false)}
              header="Fehler"
              subHeader="Emailadresse nicht gefunden"
              message="Die Eingabe Ihrer Zurücksetzungs-Daten hat nicht funktioniert. Bitte vergewissern Sie sich, ob Sie bereits einen Account bei uns haben und Sie die Email-Adresse richtig eingegeben haben. "
              buttons={['OK']}
            />
          </section>
        </IonCenterContent>
      </IonContent>
    </AppPage>
  );
};
