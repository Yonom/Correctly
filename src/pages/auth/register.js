/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText, IonAlert } from '@ionic/react';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

/* Custom components */
import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

/* authentification functions */
import { register } from '../../services/auth';

export default () => {
  const [showRegisterErrorAlert, setShowRegisterErrorAlert] = useState(false);
  const [showMatchingPasswordErrorAlert, setShowMatchingPasswordErrorAlert] = useState(false);
  const [showRegisterSuccessful, setShowRegisterSuccessful] = useState(false);

  /* executes the register function from '../../services/auth' and triggers an error message if an exception occures */
  const doRegister = async (email, password, firstName, lastName, studentId) => {
    try {
      await register(email, password, firstName, lastName, studentId);
      setShowRegisterSuccessful(true);
    } catch (ex) {
      setShowRegisterErrorAlert(true);
    }
  };

  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (data.password === data.password_confirmed) {
      doRegister(data.email, data.password, data.firstName, data.lastName, data.studentId);
    } else {
      setShowMatchingPasswordErrorAlert(true);
    }
  };

  return (
    <AppPage title="Registrierungs Seite" footer="Correctly">
      <IonContent>
        <IonCenterContent innerStyle={{ padding: '10%' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonList lines="full" class="ion-no-margin ion-no-padding">
              <IonItem>
                <IonLabel position="stacked">Vorname  <IonText color="danger">*</IonText></IonLabel>
                <IonController type="text" as={IonInput} control={control} name="firstName" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Nachname  <IonText color="danger">*</IonText></IonLabel>
                <IonController type="text" as={IonInput} control={control} name="lastName" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Email-Adresse  <IonText color="danger">*</IonText></IonLabel>
                <IonController type="email" as={IonInput} control={control} name="email" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Passwort <IonText color="danger">*</IonText></IonLabel>
                <IonController type="password" as={IonInput} control={control} name="password" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Passwort bestätigen <IonText color="danger">*</IonText></IonLabel>
                <IonController type="password" as={IonInput} control={control} name="password_confirmed" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Matrikelnummer </IonLabel>
                <IonController type="text" as={IonInput} control={control} name="studentID" />
              </IonItem>
            </IonList>
            <div className="ion-padding">
              <IonButton type="submit" expand="block" class="ion-no-margin">Registrieren</IonButton>
            </div>
          </form>
          <section className="full-width">
            <Link href="/auth/login" passHref><IonButton expand="full" color="secondary">Zurück zum Login </IonButton></Link>
          </section>

          <IonAlert
            isOpen={showRegisterErrorAlert}
            onDidDismiss={() => setShowRegisterErrorAlert(false)}
            header="Registrierung nicht erfolgreich"
            subHeader="Die Eingabe Ihrer Registrierungs-Daten ist unvollständig oder inkorrekt."
            message=""
            buttons={['OK']}
          />
          <IonAlert
            isOpen={showMatchingPasswordErrorAlert}
            onDidDismiss={() => setShowMatchingPasswordErrorAlert(false)}
            header="Passwörter stimmen nicht überein"
            subHeader="Bitte achten Sie darauf, dass ihre Passwörter übereinstimmen."
            message=""
            buttons={['OK']}
          />
          <IonAlert
            isOpen={showRegisterSuccessful}
            onDidDismiss={() => setShowRegisterSuccessful(false)}
            header="Registrierung erfolgreich!"
            subHeader="Sie haben sich erfolgreich bei Correctly registriert. Um Ihre Registrierung abzuschließen, bestätigen sie den Registrierungs-Link, den wir Ihnen per Mail geschickt haben."
            message=""
            buttons={['OK']}
          />

        </IonCenterContent>
      </IonContent>
    </AppPage>
  );
};
