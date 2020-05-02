/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText, IonAlert } from '@ionic/react';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

/* Custom components */
import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

/* authentification functions */
import { confirmPasswordReset } from '../../services/auth';

export default () => {
  const [showChangeErrorAlert, setShowChangeErrorAlert] = useState(false);
  const [showMatchingPasswordErrorAlert, setShowMatchingPasswordErrorAlert] = useState(false);

  /* executes the login function from '../../services/auth' and triggers an error message if an exception occures */
  const doConfirmPasswordReset = async (token, password) => {
    try {
      await confirmPasswordReset(token, password);
      /* redirect to main page here */
    } catch (ex) {
      setShowChangeErrorAlert(true);
    }
  };

  const { control, handleSubmit } = useForm();

  const getTokenFromURL = () => {
    const { search } = window.location;
    const params = new URLSearchParams(search);
    return params.get('oobToken');
  };

  const onSubmit = (data) => {
    if (data.password === data.password_confirm && data.password !== '') {
      const token = getTokenFromURL();
      if (token) { doConfirmPasswordReset(token, data.password); } else { doConfirmPasswordReset(data.token, data.password); }
    } else { setShowMatchingPasswordErrorAlert(true); }
  };

  const checkForToken = () => {
    const token = getTokenFromURL();
    const test = 'Bestätigungscode';
    if (typeof token === 'object' || token === '') {
      return (
        <IonItem>
          <IonLabel position="stacked">{test}<IonText color="danger">*</IonText></IonLabel>
          <IonController type="text" as={IonInput} control={control} name="token" />
        </IonItem>
      );
    }
  };

  return (
    <AppPage title="Passwort vergessen" footer="Correctly">
      <IonContent>
        <IonCenterContent innerStyle={{ padding: '10%' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonList lines="full">
              {checkForToken()}
              <IonItem>
                <IonLabel position="stacked">Neues Passwort<IonText color="danger">*</IonText></IonLabel>
                <IonController type="password" as={IonInput} control={control} name="password" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Neues Passwort bestätigen<IonText color="danger">*</IonText></IonLabel>
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
        </IonCenterContent>
      </IonContent>
    </AppPage>
  );
};
