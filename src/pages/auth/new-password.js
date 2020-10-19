/* Ionic imports */
import { IonLabel, IonList, IonInput, IonText } from '@ionic/react';

import { useForm } from 'react-hook-form';
import Router, { useRouter } from 'next/router';
import { makeToast } from '../../components/GlobalNotifications';

/* Custom components */
import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

/* authentification functions */
import { confirmPasswordReset } from '../../services/auth';

/* data validation functions */
import { makeAPIErrorAlert, onSubmitError } from '../../utils/errors';
import SubmitButton from '../../components/SubmitButton';
import SafariFixedIonItem from '../../components/SafariFixedIonItem';

const NewPasswordPage = () => {
  const getToken = useRouter().query.oobCode;

  /* executes the login function from '../../services/auth' and triggers an error message if an exception occures */
  const doConfirmPasswordReset = async (token, password) => {
    try {
      await confirmPasswordReset(token, password);
      makeToast({ message: 'Password was successfully reset.' });
      Router.push('/auth/login');
    } catch (ex) {
      // if (ex.code === 'auth/invalid-action-code') { console.log('PW:', password, 'Token:', token); redirectToLogin(); } // this line is for debugging purposes

      makeAPIErrorAlert(ex);
    }
  };

  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (getToken) {
      doConfirmPasswordReset(getToken, data.password);
    } else {
      doConfirmPasswordReset(data.token, data.password);
    }
  };

  const checkForToken = () => {
    if (!getToken) {
      return (
        <SafariFixedIonItem>
          <IonLabel position="stacked">
            Confirmation code
            {' '}
            <IonText color="danger">*</IonText>
          </IonLabel>
          <IonController type="text" as={IonInput} control={control} name="token" />
        </SafariFixedIonItem>
      );
    }
    return ('');
  };

  return (
    <AppPage title="New Password">
      <IonCenterContent>
        <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
          <IonList lines="full">
            {checkForToken()}
            <SafariFixedIonItem>
              <IonLabel position="stacked">
                New password
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="password" as={IonInput} control={control} name="password" />
            </SafariFixedIonItem>
            <SafariFixedIonItem>
              <IonLabel position="stacked">
                Confirm new password
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="password" as={IonInput} control={control} name="password_confirm" />
            </SafariFixedIonItem>
          </IonList>
          <div className="ion-padding">
            <SubmitButton expand="block" class="ion-no-margin">Set new password</SubmitButton>
          </div>
        </form>
      </IonCenterContent>
    </AppPage>
  );
};

export default NewPasswordPage;
