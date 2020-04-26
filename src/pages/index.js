import {
  IonButton, IonIcon, IonContent, IonLabel, IonItem, IonList, IonInput, IonText,
} from '@ionic/react';

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
          <IonButton expand="block" type="submit" class="ion-no-margin">Anmelden</IonButton>
        </div>
      </IonContent>
    </div>
  );
};
