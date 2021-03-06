import { IonLabel, IonChip, IonIcon } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import { useState } from 'react';

const UserChip = ({ user, roleString, onCheck }) => {
  const [showChip, setShowChip] = useState(true);
  if (showChip) {
    return (
      <IonChip key={user.userid}>
        <IonLabel>{`${user.firstname} ${user.lastname}`}</IonLabel>
        <IonIcon icon={closeCircle} onClick={(e) => onCheck(e, user, roleString, setShowChip)} />
      </IonChip>
    );
  } return '';
};

export default UserChip;
