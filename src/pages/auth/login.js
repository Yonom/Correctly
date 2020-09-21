/* Ionic imports */
import { IonButton, IonLabel, IonItem, IonList, IonInput, IonText } from '@ionic/react';

import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Router from 'next/router';

/* Custom components */
import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

/* authentification functions */
import { login } from '../../services/auth';
import { makeToast } from '../../components/GlobalNotifications';
import { makeAPIErrorAlert, onSubmitError } from '../../utils/errors';
import SubmitButton from '../../components/SubmitButton';

const Login = () => {
  /* executes the login function from '../../services/auth' and triggers an error message if an exception occures */
  const doLogin = async (email, password) => {
    try {
      await login(email, password);
      makeToast({ message: 'Login erfolgreich.' });
    } catch (ex) {
      if (ex.code === 'auth/not-registered') {
        Router.push('/auth/register?isLoggedIn=true');
      } else {
        makeAPIErrorAlert(ex);
      }
    }
  };

  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    doLogin(data.email, data.password);
  };

  return (
    <AppPage title="Login Seite">
      <IonCenterContent>
        <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
          <IonList lines="full" class="ion-no-margin ion-no-padding">
            <IonItem>
              <IonLabel position="stacked">
                Email-Adresse
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="email" as={IonInput} control={control} name="email" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">
                Passwort
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="password" as={IonInput} control={control} name="password" />
            </IonItem>
          </IonList>
          <div className="ion-padding">
            <SubmitButton expand="block" class="ion-no-margin">Anmelden</SubmitButton>
          </div>
        </form>
        <div className="ion-padding">
          <IonText>
            Probleme bei der Anmeldung?
            {' '}
            <Link href="/auth/forgot-password"><a>Passwort vergessen</a></Link>
          </IonText>
        </div>
        <section className="full-width">
          <Link href="/auth/register" passHref><IonButton expand="full" color="secondary">Zur Registrierung</IonButton></Link>
        </section>
      </IonCenterContent>
    </AppPage>
  );
};

export default Login;
