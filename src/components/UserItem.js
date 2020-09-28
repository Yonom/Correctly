import { IonLabel, IonCheckbox, IonItem } from '@ionic/react';
import { useState } from 'react';

const UserItem = ({ user, id, selected, roleString, onCheck }) => {
  const [checked, setChecked] = useState(selected);

  const idString = user.studentid !== undefined && user.studentid !== null
    ? `(id: ${user.studentid})`
    : '';

  return (
    <div style={{ width: '100%' }}>
      <IonItem key={id}>
        <IonLabel>{`${user.firstname} ${user.lastname} ${idString}`}</IonLabel>
        <IonCheckbox checked={checked} onIonChange={(e) => onCheck(e, user, setChecked, roleString)} />
      </IonItem>
    </div>
  );
};

export default UserItem;
