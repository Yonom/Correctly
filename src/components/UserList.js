import { IonButton, IonLabel, IonText, IonInput } from '@ionic/react';
import { useForm } from 'react-hook-form';
import styles from './User.module.css';
import Expandable from './Expandable';
import IonController from './IonController';

const UserList = ({ userID, userLastname, userFirstname, userStudentid, userEmail }) => {
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
            <IonController as={IonInput} value={userLastname} control={control} name="userLastname" onChange={(e) => e.target.value} />
          </div>

          <div>
            <IonLabel position="stacked">
              Vorname
              {' '}
              <IonText color="danger">*</IonText>
            </IonLabel>
            <IonController as={IonInput} name="userFirstname" value={userFirstname} control={control} onChange={(e) => e.target.value} />
          </div>

          <div>
            <IonLabel position="stacked">
              Matrikelnummer
              {' '}
              <IonText color="danger">*</IonText>
            </IonLabel>
            <IonController as={IonInput} name="userStudentid" value={userStudentid} control={control} onChange={(e) => e.target.value} />
          </div>

          <div>
            <IonLabel position="stacked">
              E-Mail
              {' '}
              <IonText color="danger">*</IonText>
            </IonLabel>
            <IonController as={IonInput} name="userEmail" value={userEmail} control={control} onChange={(e) => e.target.value} />
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

export default UserList;
