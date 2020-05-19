import { IonButton, IonLabel, IonText, IonInput } from '@ionic/react';

import styles from './User.module.css';
import Expandable from './Expandable';

export default ({ userID, userName, userEmail }) => {
  return (
    <>
      <Expandable header={userName} subheader={userEmail}>
        <div style={{ width: '100%' }}>
          <IonLabel position="stacked">
            Name

            <IonText color="danger">*</IonText>
          </IonLabel>
          <IonInput required type="text" value={userName} />
        </div>

        <div>
          <IonLabel position="stacked">
            Vorname
            {' '}
            <IonText color="danger">*</IonText>
          </IonLabel>
          <IonInput required type="text" />
        </div>

        <div>
          <IonLabel position="stacked">
            Matrikelnummer
            {' '}
            <IonText color="danger">*</IonText>
          </IonLabel>
          <IonInput required type="text" />
        </div>

        <div>
          <IonLabel position="stacked">
            E-Mail
            {' '}
            <IonText color="danger">*</IonText>
          </IonLabel>
          <IonInput required type="text" value={userEmail} />
        </div>
        <div className={styles.userFooter}>
          <IonButton color="success">Speicher</IonButton>
          <IonButton color="danger" onClick={() => console.log(userID)}>Nutzer löschen</IonButton>
        </div>
      </Expandable>
    </>
  );
};
