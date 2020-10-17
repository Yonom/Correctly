import { IonLabel, IonCheckbox } from '@ionic/react';
import SafariFixedIonItem from './SafariFixedIonItem';

const UserItem = ({ user, checked, roleString, onCheck }) => {
  const idString = user.studentid !== undefined && user.studentid !== null
    ? `(id: ${user.studentid})`
    : '';

  return (
    <div style={{ width: '100%' }}>
      <SafariFixedIonItem>
        <IonLabel>{`${user.firstname} ${user.lastname} ${idString}`}</IonLabel>
        <IonCheckbox checked={checked} onIonChange={(e) => onCheck(e, user, roleString)} />
      </SafariFixedIonItem>
    </div>
  );
};

export default UserItem;
