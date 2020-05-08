/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText } from '@ionic/react';

import React, { useState } from 'react';
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
import { isValidName } from '../../utils/auth/isValidName';
import { isValidEmail } from '../../utils/auth/isValidEmail';
import { isValidPassword } from '../../utils/auth/isValidPassword';
import { isValidStudentId } from '../../utils/auth/isValidStudentId';
import { isStudentEmail } from '../../utils/auth/isStudentEmail';
import { makeAlert } from '../../components/GlobalNotifications';

export default () => {
  const { query: { isLoggedIn } } = useRouter();
  const [isStudentIdRequired, setStudentIdRequired] = useState(false);

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
      makeAlert({
        header: 'Registrierung nicht erfolgreich',
        subHeader: 'Die Eingabe Ihrer Registrierungs-Daten ist unvollständig oder inkorrekt.',
      });
    }
  };


  const { control, handleSubmit } = useForm();

  const onMailadressInput = (email) => {
    if (isStudentEmail(email)) {
      setStudentIdRequired(true);
    } else { setStudentIdRequired(false); }
  };

  const onSubmit = (data) => {
    if (isValidName(data.firstName) && isValidName(data.lastName)) {
      if (isLoggedIn || isValidEmail(data.email)) {
        if (isLoggedIn || isValidPassword(data.password)) {
          if (data.password === data.password_confirmed) {
            const email = isLoggedIn ? getCurrentUser().email : data.email;
            const isStudent = isStudentEmail(email);
            const studentId = isStudent ? parseInt(data.studentId, 10) : null;

            if (isValidStudentId(email, studentId)) {
              doRegister(data.email, data.password, data.firstName, data.lastName, studentId);
            } else {
              makeAlert({
                header: 'Falsche Matrikelnummer',
                subHeader: 'Bitte geben Sie Ihre 7-stellige Matrikelnummer ein (nur Ziffern).',
              });
            }
          } else {
            makeAlert({
              header: 'Passwörter stimmen nicht überein',
              subHeader: 'Bitte achten Sie darauf, dass ihre Passwörter übereinstimmen.',
            });
          }
        } else {
          makeAlert({
            header: 'Falsches Passwort Format!',
            subHeader: 'Mindestens 8, maximal 20 Stellen; Mindestens eine Zahl, ein Großbuchstabe und ein Kleinbuchstabe.',
          });
        }
      } else {
        makeAlert({
          header: 'Falsche E-Mail!',
          subHeader: 'Bitte benutzen Sie ihre @fs-students oder @fs E-Mail Adresse.',
        });
      }
    } else {
      makeAlert({
        header: 'Falsches Format!',
        subHeader: 'Bitte überprüfen Sie die Eingabe ihres Vor- und Nachnamen.',
      });
    }
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
                <IonItem onIonChange={(e) => onMailadressInput(e.target.value)}>
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
