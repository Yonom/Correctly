/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText, IonAlert } from '@ionic/react';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Router from 'next/router';

/* Custom components */
import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

/* authentification functions */
import { login } from '../../services/auth';
import { useToaster } from '../../components/GlobalToast';

export default () => {
  const [showLoginErrorAlert, setShowLoginErrorAlert] = useState(false);
  const makeToast = useToaster();

  /* executes the login function from '../../services/auth' and triggers an error message if an exception occures */
  const doLogin = async (email, password) => {
    try {
      await login(email, password);
      makeToast({ message: 'Login erfolgreich.' });
    } catch ({ code }) {
      if (code === 'auth/not-registered') {
        Router.push('/auth/register?isLoggedIn=true');
      } else {
        setShowLoginErrorAlert(true);
      }
    }
  };

  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    doLogin(data.email, data.password);
  };

  return (
    <AppPage title="Kurse anlegen" footer="Correctly">
      <IonContent>
        <IonCenterContent innerStyle={{ padding: '10%' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonList lines="full" class="ion-no-margin ion-no-padding">
              <IonItem>
                <IonLabel> Kurstitel eingeben</IonLabel>
                <IonController> </IonController>
              </IonItem>
            </IonList>
          </form>
          <IonAlert
            isOpen={showLoginErrorAlert}
            onDidDismiss={() => setShowLoginErrorAlert(false)}
            header="Falsche Login-Daten"
            subHeader="Passwort falsch, oder Nutzer nicht gefunden."
            message=""
            buttons={['OK']}
          />

        </IonCenterContent>
      </IonContent>
    </AppPage>
  );
};
