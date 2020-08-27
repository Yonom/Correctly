import { IonCard, IonCardContent, IonItem, IonLabel, IonButton, IonLoading } from '@ionic/react';
import { useRouter } from 'next/router';
import AppPage from '../../components/AppPage';
import IonCenterContent from '../../components/IonCenterContent';
import { useUser } from '../../services/users';

const ProfilePage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: user, error } = useUser(userId);

  return (
    <AppPage title="Profilseite" footer="Correctly">
      <IonCenterContent>
        <IonCard>
          <IonCardContent>
            <IonItem>
              <IonLabel style={{ fontSize: 32 }}>
                {user?.firstName}
                {' '}
                {user?.lastName}
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <strong>Rolle:</strong>
                {' '}
                {user?.role}
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <strong>E-Mail:</strong>
                {' '}
                {user?.email}
              </IonLabel>
            </IonItem>

            <IonButton href={`mailto:${user?.email}`}>E-Mail Senden</IonButton>
          </IonCardContent>
        </IonCard>

      </IonCenterContent>
      <IonLoading isOpen={!user && !error} />
    </AppPage>
  );
};

export default ProfilePage;
