/* Ionic imports */
import { IonButton, IonLabel, IonInput, IonText } from '@ionic/react';

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
import { makeAPIErrorAlert, onSubmitError } from '../../utils/errors';
import SubmitButton from '../../components/SubmitButton';
import SafariFixedIonItem from '../../components/SafariFixedIonItem';

const ForgotPasswordPage = () => {
  const doPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(email);
      makeToast({ message: 'Your password has been reset. Complete the reset of your password by confirming the reset email and using the reset link to set a new password.' });
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
    <AppPage title="Reset Password Page">
      <IonCenterContent>
        <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
          <SafariFixedIonItem>
            <IonLabel position="stacked">
              Email address
              {' '}
              <IonText color="danger">*</IonText>
            </IonLabel>
            <IonController type="email" as={IonInput} control={control} name="email" />
          </SafariFixedIonItem>
          <div className="ion-padding">
            <SubmitButton expand="block" class="ion-no-margin">Reset password</SubmitButton>
          </div>
        </form>
        <section className="ion-padding">
          <Link href="/auth/login" passHref>
            <IonButton color="medium" size="default" fill="clear" expand="block" class="ion-no-margin">Back to login</IonButton>
          </Link>
        </section>
      </IonCenterContent>
    </AppPage>
  );
};

export default ForgotPasswordPage;
