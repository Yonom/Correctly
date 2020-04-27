import {
  IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText, IonAlert, IonTitle, IonFooter, IonToolbar,
} from '@ionic/react';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../services/auth';

export default () => {
  const [showLoginErrorAlert, setShowLoginErrorAlert] = useState(false);
  const {
    register, handleSubmit, setValue, errors,
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };

  React.useEffect(() => {
    register({ name: 'email' }); // custom register react-select
    register({ name: 'password' }); // custom register antd input
  }, [register]);

  const doLogin = async () => {
    try {
      await login('test', 'test');
    } catch (ex) {
      setShowLoginErrorAlert(true);
    }
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
              <IonInput
                required
                name="email"
                type="email"
                ref={register({
                  required: 'Required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'invalid email address',
                  },
                })}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Passwort <IonText color="danger">*</IonText></IonLabel>
              <IonInput
                required
                name="password"
                type="password"
                ref={register({
                  required: 'Required',
                })}
              />
            </IonItem>
          </IonList>
          <div className="ion-padding">
            <IonButton onClick={() => doLogin()} expand="block" class="ion-no-margin">Anmelden</IonButton>
          </div>
          <div className="ion-padding">
            <IonText>Probleme bei der Anmeldung? <a href="/">Passwort vergessen!</a></IonText>
          </div>
          <section className="full-width">
            <IonButton type="submit" expand="full" color="secondary">Zur Registrierung</IonButton>
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
