/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText } from '@ionic/react';

import React from 'react';
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
import { makeAPIErrorAlert } from '../../utils/errors';

export default () => {
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
        header: 'Registrierung erfolgreich!',
        subHeader: `Sie haben sich erfolgreich bei Correctly registriert. ${isLoggedIn ? '' : 'Um Ihre Registrierung abzuschließen, bestätigen sie den Registrierungs-Link, den wir Ihnen per Mail geschickt haben.'}`,

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
    <AppPage title="Registrierungs Seite" footer="Correctly">
      <IonContent>
        <IonCenterContent innerStyle={{ padding: '10%' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonList lines="full" class="ion-no-margin ion-no-padding">
              <IonItem>
                <IonLabel position="stacked">
                  Vorname
                  {' '}
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController type="text" as={IonInput} control={control} name="firstName" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                  Nachname
                  {' '}
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController type="text" as={IonInput} control={control} name="lastName" />
              </IonItem>
              {!isLoggedIn && (
              <>
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
                <IonItem>
                  <IonLabel position="stacked">
                    Passwort bestätigen
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
                  Matrikelnummer
                  {' '}
                  <IonText color="danger">*</IonText>
                  {' '}
                </IonLabel>
                <IonController type="text" as={IonInput} control={control} name="studentId" id="studentId" />
              </IonItem>
              )}
            </IonList>
            <div className="ion-padding">
              <IonButton type="submit" expand="block" class="ion-no-margin">Registrieren</IonButton>
            </div>
          </form>
          <section className="full-width">
            <Link href="/auth/login" passHref><IonButton expand="full" color="secondary">Zurück zum Login </IonButton></Link>
          </section>
        </IonCenterContent>
      </IonContent>
    </AppPage>
  );
};
