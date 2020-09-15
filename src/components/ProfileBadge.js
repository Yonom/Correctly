import React from 'react';
import { IonIcon, IonText, IonAvatar, IonSkeletonText } from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import styles from './AppPage.module.css';
import { useMyData } from '../services/auth';
import { getRoleLabel } from '../utils/auth/getRoleLabel';

const ProfileBadge = () => {
  const { data, error } = useMyData();
  if (error) {
    return <IonText slot="end">Failed to load profile data!</IonText>;
  }

  if (!data) {
    return (
      <>
        <IonText slot="end" style={{ display: 'flex', flexDirection: 'column' }}>
          <IonSkeletonText animated style={{ width: '80px' }} />
          <IonSkeletonText animated className="ion-align-self-end" style={{ width: '60px' }} />
        </IonText>
        <IonAvatar slot="end" className={styles.profilePicture}>
          <IonSkeletonText animated />
        </IonAvatar>
      </>
    );
  }

  if (!data.loggedIn) {
    return null;
  }

  const name = `${data.firstname} ${data.lastname}`;
  const { role } = data;

  return (
    <>
      <IonText slot="end">
        {name}
        <br />
        {getRoleLabel(role)}
      </IonText>
      <IonIcon slot="end" icon={personCircleOutline} className={styles.profilePicture} />
    </>
  );
};

export default ProfileBadge;
