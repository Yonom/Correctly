import { IonLabel, IonCheckbox, IonItem } from '@ionic/react';
import { useState } from 'react';

const UserItem = ({ user, key, selected, roleString, onCheck }) => {
  const [checked, setChecked] = useState(selected);
  return (
    <div style={{ width: '100%' }}>
      <IonItem key={key}>
        <IonLabel>{`${user.firstname} ${user.lastname}`}</IonLabel>
        <IonCheckbox checked={checked} onIonChange={(e) => onCheck(e, user, setChecked, roleString)} />
      </IonItem>
    </div>
  );
};

export default UserItem;
