import { IonLabel, IonCheckbox, IonItem } from '@ionic/react';
import { useState } from 'react';

const UserItem = ({ user, selected, roleString, onCheck }) => {
  const [checked, setChecked] = useState(selected);
  return (
    <div style={{ width: '100%' }}>
      <IonItem key={user.key}>
        <IonLabel>{`${user.firstname} ${user.lastname}`}</IonLabel>
        <IonCheckbox checked={checked} onIonChange={(e) => onCheck(e, user, setChecked, roleString)} />
      </IonItem>
    </div>
  );
};

export default UserItem;
