/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonInput, IonText, IonToast, IonAlert } from '@ionic/react';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

/* Custom components */
import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

/* authentification functions */
import { sendPasswordResetEmail } from '../../services/auth';

export default () => {
  const [showAlertFail, setShowAlertFail] = useState(false);


  const doPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(email);
    } catch (ex) {
      setShowAlertFail(true);
    }
  };


  const { control, handleSubmit } = useForm();


  const onSubmit = (data) => {
    doPasswordReset(data.email);
  };

  return (
    <AppPage title="Reset Passwort Seite" footer="Correctly">
      <IonContent>
        <IonCenterContent innerStyle={{ padding: '10%' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem>
              <IonLabel position="stacked">Email-Adresse <IonText color="danger">*</IonText></IonLabel>
              <IonController type="email" as={IonInput} control={control} name="email" />
            </IonItem>
            <div className="ion-padding">
              <IonButton type="submit" expand="block" class="ion-no-margin">Passwort zurücksetzten</IonButton>
            </div>
          </form>
          <section className="ion-padding">
            <Link href="/auth/login" passHref>
              <IonButton color="medium" size="default" fill="clear" expand="block" class="ion-no-margin">Zurück zum Login</IonButton>
            </Link>
          </section>
          <section>
            <IonAlert
              isOpen={showAlertFail}
              onDidDismiss={() => setShowAlertFail(false)}
              header="Fehler"
              subHeader="Emailadresse nicht gefunden"
              message="Die Eingabe Ihrer Zurücksetzungs-Daten hat nicht funktioniert. Bitte vergewissern Sie sich, ob Sie bereits einen Account bei uns haben und Sie die Email-Adresse richtig eingegeben haben. "
              buttons={['OK']}
            />
          </section>
        </IonCenterContent>
      </IonContent>
    </AppPage>
  );
};
