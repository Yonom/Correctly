import { IonLabel, IonRadio } from '@ionic/react';
import SafariFixedIonItem from './SafariFixedIonItem';

const UserRadio = ({ user, id }) => {
  return (
    <div style={{ width: '100%' }}>
      <SafariFixedIonItem key={id}>
        <IonLabel>{`${user.firstname} ${user.lastname}`}</IonLabel>
        <IonRadio value={`radio_u${user.userid}`} />
      </SafariFixedIonItem>
    </div>
  );
};

export default UserRadio;
