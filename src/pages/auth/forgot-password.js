/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonInput, IonText } from '@ionic/react';

import React from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

/* Custom components */
import Router from 'next/router';
import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

/* authentification functions */
import { sendPasswordResetEmail } from '../../services/auth';

/* utils */
import { makeToast } from '../../components/GlobalNotifications';
import { makeAPIErrorAlert } from '../../utils/errors';

export default () => {
  const doPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(email);
      makeToast({ message: 'Ihr Passwort wurde zurückgesetzt. Schließen sie das Zurücksetzen ihres Passworts ab, indem Sie die Zurücksetzungs-Mail bestätigen und mit dem Zurücksetzungs-Link ein neues Passwort festlegen.' });
      await Router.push('/auth/login');
    } catch (ex) {
      makeAPIErrorAlert(ex);
    }
  };

  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    doPasswordReset(data.email);
  };

  return (
    <AppPage title="Reset Passwort Seite" footer="Correctly">
      <IonContent>
        <IonCenterContent innerStyle={{ padding: '10%' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem>
              <IonLabel position="stacked">
                Email-Adresse
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="email" as={IonInput} control={control} name="email" />
            </IonItem>
            <div className="ion-padding">
              <IonButton type="submit" expand="block" class="ion-no-margin">Passwort zurücksetzten</IonButton>
            </div>
          </form>
          <section className="ion-padding">
            <Link href="/auth/login" passHref>
              <IonButton color="medium" size="default" fill="clear" expand="block" class="ion-no-margin">Zurück zum Login</IonButton>
            </Link>
          </section>
        </IonCenterContent>
      </IonContent>
    </AppPage>
  );
};
