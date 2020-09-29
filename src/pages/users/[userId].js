import { IonCard, IonCardContent, IonItem, IonLabel, IonButton, IonLoading, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/react';
import { useRouter } from 'next/router';
import { mailOutline } from 'ionicons/icons';
import AppPage from '../../components/AppPage';
import IonCenterContent from '../../components/IonCenterContent';
import { useUser } from '../../services/users';
import BiographyEditor from '../../components/users/BiographyEditor';
import { useOnErrorAlert } from '../../utils/errors';
import { getRoleLabel } from '../../utils/auth/getRoleLabel';

const ProfilePage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: user, error } = useOnErrorAlert(useUser(userId));

  return (
    <AppPage title="Profilseite">
      <IonCenterContent>
        <IonCard>
          <IonCardContent>
            <IonItem style={{ '--padding-start': 0 }}>
              <IonLabel style={{ fontSize: 32 }}>
                {user?.firstName}
                {' '}
                {user?.lastName}
              </IonLabel>
            </IonItem>

            <IonItem style={{ '--padding-start': 0 }}>
              <IonLabel>
                <strong>Rolle:</strong>
                {' '}
                {getRoleLabel(user?.role)}
              </IonLabel>
            </IonItem>

            <IonItem style={{ '--padding-start': 0 }}>
              <IonLabel>
                <strong>E-Mail:</strong>
                {' '}
                {user?.email}
              </IonLabel>
            </IonItem>

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
