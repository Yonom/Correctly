import React from 'react';
import { IonIcon, IonText, IonAvatar, IonSkeletonText } from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import styles from './ProfileBadge.module.css';
import { useMyData } from '../services/auth';
import { getRoleLabel } from '../utils/auth/getRoleLabel';

const ProfileBadge = ({ slot = 'end' }) => {
  const { data, error } = useMyData();
  if (error) {
    return <IonText slot={slot}>Failed to load profile data!</IonText>;
  }

  if (!data) {
    return (
      <>
        <IonText slot={slot} style={{ display: 'flex', flexDirection: 'column' }}>
          <IonSkeletonText animated style={{ width: '80px' }} />
          <IonSkeletonText animated className="ion-align-self-end" style={{ width: '60px' }} />
        </IonText>
        <IonAvatar slot={slot} className={styles.profilePicture}>
          <IonSkeletonText animated />
        </IonAvatar>
      </>
    );
  }

  if (!data.loggedIn) {
    return null;
  }

  const name = `${data.firstname} ${data.lastname}`;
  const userId = `${data.userId}`;
  const profileLink = '/users/'.concat(userId);
  const { role } = data;

  return (
    <>
      <IonText slot={slot} style={{ flexGrow: 1 }}>
        {name}
        <br />
        {getRoleLabel(role)}
      </IonText>
      <IonIcon style={{ cursor: 'pointer' }} slot={slot} icon={personCircleOutline} className={styles.profilePicture} button onClick={() => { window.location.href = profileLink; }} />
    </>
  );
};

export default ProfileBadge;
