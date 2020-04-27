import {
  IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText, IonAlert, IonTitle, IonFooter, IonToolbar,
} from '@ionic/react';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import IonController from '../components/IonController';
import { login } from '../services/auth';

export default () => {
  const [showLoginErrorAlert, setShowLoginErrorAlert] = useState(false);

  const doLogin = async (email, password) => {
    console.log(email, password);
    try {
      await login(email, password);
    } catch (ex) {
      setShowLoginErrorAlert(true);
      console.log(ex);
    }
  };

  const {
    control, handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    doLogin(data.email, data.password);
  };

  return (
    <>
      <ion-header>
        <ion-toolbar>
          <ion-title>Login-Seite</ion-title>
        </ion-toolbar>
      </ion-header>

      <IonContent fullscreen>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonList lines="full" class="ion-no-margin ion-no-padding">
            <IonItem>
              <IonLabel position="stacked">Email-Adresse  <IonText color="danger">*</IonText></IonLabel>
              <IonController type="email" as={IonInput} control={control} name="email" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Passwort <IonText color="danger">*</IonText></IonLabel>
              <IonController type="password" as={IonInput} control={control} name="password" />
            </IonItem>
          </IonList>
          <div className="ion-padding">
            <IonButton type="submit" expand="block" class="ion-no-margin">Anmelden</IonButton>
          </div>
          <div className="ion-padding">
            <IonText>Probleme bei der Anmeldung? <a href="/">Passwort vergessen!</a></IonText>
          </div>
          <section className="full-width">
            <IonButton expand="full" color="secondary">Zur Registrierung</IonButton>
          </section>
          <IonAlert
            isOpen={showLoginErrorAlert}
            onDidDismiss={() => setShowLoginErrorAlert(false)}
            header="Falsche Login-Daten"
            subHeader="Passwort falsch, oder Nutzer nicht gefunden."
            message=""
            buttons={['OK']}
          />
        </form>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonTitle>Correctly</IonTitle>
        </IonToolbar>
      </IonFooter>
    </>
  );
};
