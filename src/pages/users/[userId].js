import { IonCard, IonCardContent, IonLabel, IonButton, IonLoading, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/react';
import { useRouter } from 'next/router';
import { mailOutline } from 'ionicons/icons';
import AppPage from '../../components/AppPage';
import IonCenterContent from '../../components/IonCenterContent';
import { useUser } from '../../services/users';
import BiographyEditor from '../../components/users/BiographyEditor';
import { useOnErrorAlert } from '../../utils/errors';
import { getRoleLabel } from '../../utils/auth/getRoleLabel';
import SafariFixedIonItem from '../../components/SafariFixedIonItem';

const ProfilePage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: user, error } = useOnErrorAlert(useUser(userId));

  return (
    <AppPage title="Profile">
      <IonCenterContent>
        <IonCard>
          <IonCardContent>
            <SafariFixedIonItem style={{ '--padding-start': 0 }}>
              <IonLabel style={{ fontSize: 32 }}>
                {user?.firstName}
                {' '}
                {user?.lastName}
              </IonLabel>
            </SafariFixedIonItem>

            <SafariFixedIonItem style={{ '--padding-start': 0 }}>
              <IonLabel>
                <strong>Role:</strong>
                {' '}
                {getRoleLabel(user?.role)}
              </IonLabel>
            </SafariFixedIonItem>

            <SafariFixedIonItem style={{ '--padding-start': 0 }}>
              <IonLabel>
                <strong>E-Mail:</strong>
                {' '}
                {user?.email}
              </IonLabel>
            </SafariFixedIonItem>

            <IonButton href={`mailto:${user?.email}`}>
              <IonIcon icon={mailOutline} slot="start" />
              Send E-Mail
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Biography
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {
              user?.canEditBiography
                ? <BiographyEditor userId={userId} user={user} />
                : user?.biography
              }
          </IonCardContent>
        </IonCard>
      </IonCenterContent>
      <IonLoading isOpen={!user && !error} />
    </AppPage>
  );
};

export default ProfilePage;
