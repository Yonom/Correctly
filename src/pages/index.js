import {
  IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText, IonRow,
} from '@ionic/react';

import Link from 'next/link';

export default () => {
  return (
    <div>
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
            <IonInput required type="text" oninput="handleFirstNameValue(event)" />
          </IonItem>
        </IonList>
        <div className="ion-padding">
          <IonButton expand="block" class="ion-no-margin">Anmelden</IonButton>
        </div>
        <div className="ion-padding">
          Probleme bei der Anmeldung? <Link href="/seiten/aufgabeWorkshop1/pageSimonBusse">Passwort vergessen</Link>
        </div>
        <section className="full-width">
          <IonButton expand="full" color="secondary">Zur Registrierung</IonButton>
        </section>
      </IonContent>
    </div>
  );
};
