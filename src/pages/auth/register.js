/* Ionic imports */
import { IonButton, IonLabel, IonItem, IonList, IonInput, IonText } from '@ionic/react';

import { useForm } from 'react-hook-form';
import Link from 'next/link';

/* Custom components */
import { useRouter } from 'next/router';
import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

/* authentification functions */
import { register, getCurrentUser, registerUserData } from '../../services/auth';

/* data validation functions */
import { isStudentEmail } from '../../utils/auth/isStudentEmail';
import { makeAlert } from '../../components/GlobalNotifications';
import { makeAPIErrorAlert, onSubmitError } from '../../utils/errors';
import SubmitButton from '../../components/SubmitButton';

const Register = () => {
  const { query: { isLoggedIn } } = useRouter();

  /* executes the register function from '../../services/auth' and triggers an error message if an exception occures */
  const doRegister = async (email, password, firstName, lastName, studentId) => {
    try {
      if (isLoggedIn) {
        await registerUserData(firstName, lastName, studentId);
      } else {
        await register(email, password, firstName, lastName, studentId);
      }

      makeAlert({
        header: 'Registration successful!',
        subHeader: `You have successfully registered at Correctly. ${isLoggedIn ? '' : 'To complete your registration, confirm the registration link we have sent you by e-mail.'}`,

      });
    } catch (ex) {
      makeAPIErrorAlert(ex);
    }
  };

  const { control, handleSubmit, watch } = useForm();
  const email = isLoggedIn ? getCurrentUser().email : watch('email');
  const isStudentIdRequired = isStudentEmail(email);

  const onSubmit = (data) => {
    const studentId = isStudentIdRequired ? parseInt(data.studentId, 10) : null;
    doRegister(data.email, data.password, data.firstName, data.lastName, studentId);
  };

  return (
    <AppPage title="Registration Page">
      <IonCenterContent>
        <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
          <IonList lines="full" class="ion-no-margin ion-no-padding">
            <IonItem>
              <IonLabel position="stacked">
                First name
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="text" as={IonInput} control={control} name="firstName" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">
                Last name
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="text" as={IonInput} control={control} name="lastName" />
            </IonItem>
            {!isLoggedIn && (
              <>
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
                <IonItem>
                  <IonLabel position="stacked">
                    Confirm password
                    {' '}
                    <IonText color="danger">*</IonText>
                  </IonLabel>
                  <IonController type="password" as={IonInput} control={control} name="password_confirmed" />
                </IonItem>
              </>
            )}
            {isStudentIdRequired && (
              <IonItem>
                <IonLabel position="stacked">
                  Student ID
                  {' '}
                  <IonText color="danger">*</IonText>
                  {' '}
                </IonLabel>
                <IonController type="text" as={IonInput} control={control} name="studentId" id="studentId" />
              </IonItem>
            )}
          </IonList>
          <div className="ion-padding">
            <SubmitButton expand="block" class="ion-no-margin">Register</SubmitButton>
          </div>
        </form>
        <section className="full-width">
          <Link href="/auth/login" passHref><IonButton expand="full" color="secondary">Back to Login </IonButton></Link>
        </section>
      </IonCenterContent>
    </AppPage>
  );
};

export default Register;
