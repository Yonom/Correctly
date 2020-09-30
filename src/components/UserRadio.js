import { IonLabel, IonRadio, IonItem } from '@ionic/react';

const UserRadio = ({ user, id }) => {
  return (
    <div style={{ width: '100%' }}>
      <IonItem key={id}>
        <IonLabel>{`${user.firstname} ${user.lastname}`}</IonLabel>
        <IonRadio value={`radio_u${user.userid}`} />
      </IonItem>
    </div>
  );
};

export default UserRadio;
