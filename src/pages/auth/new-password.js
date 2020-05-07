/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText, IonAlert } from '@ionic/react';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Router, { useRouter } from 'next/router';
import { useToaster } from '../../components/GlobalToast';

/* Custom components */
import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

/* authentification functions */
import { confirmPasswordReset } from '../../services/auth';

/* data validation functions */
import { isValidPassword } from '../../utils/isValidPassword';

export default () => {
  const [showChangeErrorAlert, setShowChangeErrorAlert] = useState(false);
  const [showMatchingPasswordErrorAlert, setShowMatchingPasswordErrorAlert] = useState(false);
  const [showPasswordInvalidErrorAlert, setShowPasswordInvalidErrorAlert] = useState(false);
  const getToken = useRouter().query.oobCode;
  const makeToast = useToaster();

  /* executes the login function from '../../services/auth' and triggers an error message if an exception occures */
  const doConfirmPasswordReset = async (token, password) => {
    try {
      await confirmPasswordReset(token, password);
      makeToast({ message: 'Passwort wurde erfolgreich zurückgesetzt.' });
      Router.push('/auth/login');
    } catch (ex) {
      // if (ex.code === 'auth/invalid-action-code') { console.log('PW:', password, 'Token:', token); redirectToLogin(); } // this line is for debugging purposes
      setShowChangeErrorAlert(true);
    }
  };

  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (data.password === data.password_confirm) {
      if (isValidPassword(data.password)) {
        if (getToken) {
          doConfirmPasswordReset(getToken, data.password);
        } else {
          doConfirmPasswordReset(data.token, data.password);
        }
      } else { setShowPasswordInvalidErrorAlert(true); }
    } else { setShowMatchingPasswordErrorAlert(true); }
  };

  const checkForToken = () => {
    if (!getToken) {
      return (
        <IonItem>
          <IonLabel position="stacked">
            Bestätigungscode
            <IonText color="danger">*</IonText>
          </IonLabel>
          <IonController type="text" as={IonInput} control={control} name="token" />
        </IonItem>
      );
    }
    return ('');
  };

  return (
    <AppPage title="Passwort vergessen" footer="Correctly">
      <IonContent>
        <IonCenterContent innerStyle={{ padding: '10%' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonList lines="full">
              {checkForToken()}
              <IonItem>
                <IonLabel position="stacked">
                  Neues Passwort
                  {' '}
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController type="password" as={IonInput} control={control} name="password" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                  Neues Passwort bestätigen
                  {' '}
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController type="password" as={IonInput} control={control} name="password_confirm" />
              </IonItem>
            </IonList>
            <div className="ion-padding">
              <IonButton type="submit" expand="block" class="ion-no-margin">Neues Passwort festlegen</IonButton>
            </div>
          </form>
          <IonAlert
            isOpen={showChangeErrorAlert}
            onDidDismiss={() => setShowChangeErrorAlert(false)}
            header="Fehler!"
            subHeader="Die Eingabe Ihres Codes oder Ihrer Passwörter war inkorrekt"
            message=""
            buttons={['OK']}
          />

          <IonAlert
            isOpen={showMatchingPasswordErrorAlert}
            onDidDismiss={() => setShowMatchingPasswordErrorAlert(false)}
            header="Fehler!"
            subHeader="Die Passwörter stimmen nicht überein"
            message=""
            buttons={['OK']}
          />

          <IonAlert
            isOpen={showPasswordInvalidErrorAlert}
            onDidDismiss={() => setShowPasswordInvalidErrorAlert(false)}
            header="Falsches Passwortformat!"
            subHeader="Mindestens 8, maximal 20 Stellen; Mindestens eine Zahl, ein Großbuchstabe und ein Kleinbuchstabe."
            message=""
            buttons={['OK']}
          />

        </IonCenterContent>
      </IonContent>
    </AppPage>
  );
};
