/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText, IonAlert } from '@ionic/react';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

/* Custom components */
import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

/* authentification functions */
import { register } from '../../services/auth';

/* data validation functions */
import { isValidName } from '../../utils/isValidName';
import { isValidEmail } from '../../utils/isValidEmail';
import { isValidPassword } from '../../utils/isValidPassword';
import { isValidStudentId } from '../../utils/isValidStudentId';
import { isStudentEmail } from '../../utils/isStudentEmail';

export default () => {
  /* general messages */
  const [showRegisterErrorAlert, setShowRegisterErrorAlert] = useState(false);
  const [showMatchingPasswordErrorAlert, setShowMatchingPasswordErrorAlert] = useState(false);
  const [showRegisterSuccessful, setShowRegisterSuccessful] = useState(false);

  /* data validation messages */
  const [showNameValid, setShowNameValid] = useState(false);
  const [showEmailValid, setShowEmailValid] = useState(false);
  const [showPasswordValid, setShowPasswordValid] = useState(false);
  const [showStudentIdValid, setShowStudentIdValid] = useState(false);

  /* executes the register function from '../../services/auth' and triggers an error message if an exception occures */
  const doRegister = async (email, password, firstName, lastName, studentId) => {
    try {
      await register(email, password, firstName, lastName, studentId);
      setShowRegisterSuccessful(true);
    } catch (ex) {
      setShowRegisterErrorAlert(true);
    }
  };

  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (isValidName(data.firstName) & isValidName(data.lastName)) {
      if (isValidEmail(data.email)) {
        if (isValidPassword(data.password)) {
          if (data.password === data.password_confirmed) {
            const isStudent = isStudentEmail(data.email);
            const studentId = isStudent ? parseInt(data.studentId, 10) : null;

            if (isValidStudentId(data.email, studentId)) {
              doRegister(data.email, data.password, data.firstName, data.lastName, studentId);
            } else {
              setShowStudentIdValid(true);
            }
          } else {
            setShowMatchingPasswordErrorAlert(true);
          }
        } else {
          setShowPasswordValid(true);
        }
      } else {
        setShowEmailValid(true);
      }
    } else {
      setShowNameValid(true);
    }
  };


  return (
    <AppPage title="Registrierungs Seite" footer="Correctly">
      <IonContent>
        <IonCenterContent innerStyle={{ padding: '10%' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonList lines="full" class="ion-no-margin ion-no-padding">
              <IonItem>
                <IonLabel position="stacked">Vorname  <IonText color="danger">*</IonText></IonLabel>
                <IonController type="text" as={IonInput} control={control} name="firstName" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Nachname  <IonText color="danger">*</IonText></IonLabel>
                <IonController type="text" as={IonInput} control={control} name="lastName" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Email-Adresse  <IonText color="danger">*</IonText></IonLabel>
                <IonController type="email" as={IonInput} control={control} name="email" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Passwort <IonText color="danger">*</IonText></IonLabel>
                <IonController type="password" as={IonInput} control={control} name="password" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Passwort bestätigen <IonText color="danger">*</IonText></IonLabel>
                <IonController type="password" as={IonInput} control={control} name="password_confirmed" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Matrikelnummer </IonLabel>
                <IonController type="text" as={IonInput} control={control} name="studentId" />
              </IonItem>
            </IonList>
            <div className="ion-padding">
              <IonButton type="submit" expand="block" class="ion-no-margin">Registrieren</IonButton>
            </div>
          </form>
          <section className="full-width">
            <Link href="/auth/login" passHref><IonButton expand="full" color="secondary">Zurück zum Login </IonButton></Link>
          </section>

          <IonAlert
            isOpen={showRegisterErrorAlert}
            onDidDismiss={() => setShowRegisterErrorAlert(false)}
            header="Registrierung nicht erfolgreich"
            subHeader="Die Eingabe Ihrer Registrierungs-Daten ist unvollständig oder inkorrekt."
            message=""
            buttons={['OK']}
          />
          <IonAlert
            isOpen={showMatchingPasswordErrorAlert}
            onDidDismiss={() => setShowMatchingPasswordErrorAlert(false)}
            header="Passwörter stimmen nicht überein"
            subHeader="Bitte achten Sie darauf, dass ihre Passwörter übereinstimmen."
            message=""
            buttons={['OK']}
          />
          <IonAlert
            isOpen={showRegisterSuccessful}
            onDidDismiss={() => setShowRegisterSuccessful(false)}
            header="Registrierung erfolgreich!"
            subHeader="Sie haben sich erfolgreich bei Correctly registriert. Um Ihre Registrierung abzuschließen, bestätigen sie den Registrierungs-Link, den wir Ihnen per Mail geschickt haben."
            message=""
            buttons={['OK']}
          />
          <IonAlert
            isOpen={showEmailValid}
            onDidDismiss={() => setShowEmailValid(false)}
            header="Falsche E-Mail!"
            subHeader="Bitte benutzen Sie ihre @fs-students oder @fs E-Mail Adresse."
            message=""
            buttons={['OK']}
          />
          <IonAlert
            isOpen={showNameValid}
            onDidDismiss={() => setShowNameValid(false)}
            header="Falsches Format!"
            subHeader="Bitte überprüfen Sie die Eingabe ihres Vor- und Nachnamen."
            message=""
            buttons={['OK']}
          />
          <IonAlert
            isOpen={showPasswordValid}
            onDidDismiss={() => setShowPasswordValid(false)}
            header="Falsches Passwort Format!"
            subHeader="Mindestens 8, maximal 20 Stellen; Mindestens eine Zahl, ein Großbuchstabe und ein Kleinbuchstabe."
            message=""
            buttons={['OK']}
          />
          <IonAlert
            isOpen={showStudentIdValid}
            onDidDismiss={() => setShowStudentIdValid(false)}
            header="Falsche Matrikelnummer"
            subHeader="Bitte geben Sie Ihre 7-stellige Matrikelnummer ein (nur Ziffern)."
            message=""
            buttons={['OK']}
          />


        </IonCenterContent>
      </IonContent>
    </AppPage>
  );
};
