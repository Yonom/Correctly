import {
  IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText, IonAlert, IonTitle, IonFooter, IonToolbar, IonGrid, IonRow, IonCol,
} from '@ionic/react';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import IonController from '../../components/IonController';
import { login } from '../../services/auth';

import styles from '../../components/style/custom.module.css';

export default () => {
  const router = useRouter();
  const [showLoginErrorAlert, setShowLoginErrorAlert] = useState(false);

  const doLogin = async (email, password) => {
    try {
      await login(email, password);
    } catch (ex) {
      setShowLoginErrorAlert(true);
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
        <IonGrid className={styles.fullheight}>
          <IonRow className={styles.fullheight}>
            <IonCol class="ion-align-self-center">
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
                  <IonText>Probleme bei der Anmeldung? <Link href="/"><a>Passwort vergessen</a></Link>
                  </IonText>
                </div>
                <section className="full-width">
                  <IonButton onClick={() => router.push('/')} expand="full" color="secondary">Zur Registrierung</IonButton>
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
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonTitle>Correctly</IonTitle>
        </IonToolbar>
      </IonFooter>
    </>
  );
};
