/* eslint-disable jsx-a11y/anchor-is-valid */

/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText, IonAlert } from '@ionic/react';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';

/* Custom components */
import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

/* authentification functions */
import { login } from '../../services/auth';

export default () => {
  const router = useRouter();
  const [showLoginErrorAlert, setShowLoginErrorAlert] = useState(false);

  /* executes the login function from '../../services/auth' and triggers an error message if an exception occures */
  const doLogin = async (email, password) => {
    try {
      await login(email, password);
    } catch (ex) {
      setShowLoginErrorAlert(true);
    }
  };

  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    doLogin(data.email, data.password);
  };

  return (
    <AppPage title="Login Seite" footer="Correctly">
      <IonContent>
        <IonCenterContent contentPadding="10%">
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
              <IonText>Probleme bei der Anmeldung? <Link href="../"><a>Passwort vergessen</a></Link>
              </IonText>
            </div>
            <section className="full-width">
              <IonButton onClick={() => router.push('../')} expand="full" color="secondary">Zur Registrierung</IonButton>
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
        </IonCenterContent>
      </IonContent>
    </AppPage>
  );
};
