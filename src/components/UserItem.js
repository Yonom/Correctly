import { IonLabel, IonCheckbox, IonItem } from '@ionic/react';

const UserItem = ({ user, id, checked, roleString, onCheck }) => {
  const idString = user.studentid !== undefined && user.studentid !== null
    ? `(id: ${user.studentid})`
    : '';

  return (
    <div style={{ width: '100%' }}>
      <IonItem>
        <IonLabel>{`${user.firstname} ${user.lastname} ${idString}`}</IonLabel>
        <IonCheckbox checked={checked} onIonChange={(e) => onCheck(e, user, roleString)} />
      </IonItem>
    </div>
  );
};

export default UserItem;
