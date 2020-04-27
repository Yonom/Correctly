import {
  IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText, IonAlert, IonTitle, IonFooter, IonToolbar,
} from '@ionic/react';

import React, { useState } from 'react';
import { login } from '../services/auth';

export default () => {
  const [showAlert1, setShowAlert1] = useState(false);

  return (
    <>
      <ion-header>
        <ion-toolbar>
          <ion-title>Login-Seite</ion-title>
        </ion-toolbar>
      </ion-header>

      <IonContent fullscreen>
        <IonList lines="full" class="ion-no-margin ion-no-padding">
          <IonItem>
            <IonLabel position="stacked">Email-Adresse  <IonText color="danger">*</IonText></IonLabel>
            <IonInput required type="text" oninput="handleFirstNameValue(event)" />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Passwort <IonText color="danger">*</IonText></IonLabel>
            <IonInput required type="password" oninput="handleFirstNameValue(event)" />
          </IonItem>
        </IonList>
        <div className="ion-padding">
          <IonButton onClick={() => setShowAlert1(true)} expand="block" class="ion-no-margin">Anmelden</IonButton>
        </div>
        <div className="ion-padding">
          Probleme bei der Anmeldung?
        </div>
        <section className="full-width">
          <IonButton expand="full" color="secondary">Zur Registrierung</IonButton>
        </section>
        <IonAlert
          isOpen={showAlert1}
          onDidDismiss={() => setShowAlert1(false)}
          header="Alert"
          subHeader="Subtitle"
          message="This is an alert message."
          buttons={['OK']}
        />

      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonTitle>Correctly</IonTitle>
        </IonToolbar>
      </IonFooter>
    </>
  );
};
