import { IonButton, IonLabel, IonText, IonInput } from '@ionic/react';
import { useForm } from 'react-hook-form';
import styles from './User.module.css';
import Expandable from './Expandable';
import IonController from './IonController';


export default ({ userID, userLastname, userFirstname, userStudentid, userEmail }) => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <>
      <Expandable header={`${userFirstname} ${userLastname}`} subheader={userEmail}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ width: '100%' }}>
            <IonLabel position="stacked">
              Name
              <IonText color="danger">*</IonText>
            </IonLabel>
            <IonController type="text" as={IonInput} value={userLastname} control={control} name="userLastname" />
            <IonInput required type="text" name="userLastname" value={userLastname} control={control} />
          </div>

          <div>
            <IonLabel position="stacked">
              Vorname
              {' '}
              <IonText color="danger">*</IonText>
            </IonLabel>
            <IonInput required type="text" name="userFirstname" value={userFirstname} control={control} />
          </div>

          <div>
            <IonLabel position="stacked">
              Matrikelnummer
              {' '}
              <IonText color="danger">*</IonText>
            </IonLabel>
            <IonInput required type="text" name="userStudentid" value={userStudentid} control={control} />
          </div>

          <div>
            <IonLabel position="stacked">
              E-Mail
              {' '}
              <IonText color="danger">*</IonText>
            </IonLabel>
            <IonInput required type="text" name="userEmail" value={userEmail} control={control} />
          </div>
          <div className={styles.userFooter}>
            <IonButton color="success" type="submit">Speichern</IonButton>
            <IonButton color="danger" onClick={() => console.log(userID)}>Nutzer löschen</IonButton>
          </div>
        </form>
      </Expandable>
    </>
  );
};
