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
import { authProvider } from '../../utils/config';

const Login = () => {
  /* executes the login function from '../../services/auth' and triggers an error message if an exception occures */
  const doLogin = async (email, password) => {
    try {
      await login(email, password);
      makeToast({ message: 'Login successful.' });
      Router.push('/home');
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
    <AppPage title="Login Page">
      <IonCenterContent>
        <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
          <IonList lines="full" class="ion-no-margin ion-no-padding">
            <IonItem>
              <IonLabel position="stacked">
                Email address
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="email" as={IonInput} control={control} name="email" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">
                Password
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="password" as={IonInput} control={control} name="password" />
            </IonItem>
          </IonList>
          <div className="ion-padding">
            <SubmitButton expand="block" class="ion-no-margin">Login</SubmitButton>
          </div>
        </form>
        {authProvider === 'firebase' && (
          <>
            <div className="ion-padding">
              <IonText>
                Problems with login?
                {' '}
                <Link href="/auth/forgot-password"><a>Forgot password</a></Link>
              </IonText>
            </div>
            <section className="full-width">
              <Link href="/auth/register" passHref><IonButton expand="full" color="secondary">To registration</IonButton></Link>
            </section>
          </>
        )}
      </IonCenterContent>
    </AppPage>
  );
};

export default Login;
