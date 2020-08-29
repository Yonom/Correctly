import React from 'react';
import { IonIcon, IonText, IonAvatar, IonSkeletonText } from '@ionic/react';
import useSWR from 'swr';
import { personCircleOutline } from 'ionicons/icons';
import styles from './AppPage.module.css';

const ProfileBadge = () => {
  const { data, error } = useSWR('/api/auth/me');
  if (error) {
    if (error.code === 'auth/not-logged-in' || error.code === 'auth/login-expired') {
      return null;
    }
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
  const name = `${data.firstname} ${data.lastname}`;
  const { role } = data;

  return (
    <>
      <IonText slot="end">
        {name}
        <br />
        {role}
      </IonText>
      <IonIcon slot="end" icon={personCircleOutline} className={styles.profilePicture} />
    </>
  );
};

export default ProfileBadge;
