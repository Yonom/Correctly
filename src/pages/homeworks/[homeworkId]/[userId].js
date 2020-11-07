/* Ionic imports */
import { IonCard, IonCardContent, IonButton, IonLabel, IonList, IonCol, IonCardHeader, IonGrid, IonToolbar, IonRow, IonCardTitle } from '@ionic/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

/* Utils */
import { useOnErrorAlert } from '../../../utils/errors';
import { isLecturer, isStudent } from '../../../utils/auth/role';

/* Services */
import { useHomework } from '../../../services/homeworks';
import { useUser } from '../../../services/users';
import { useMyData } from '../../../services/auth';

/* Custom components */
import AppPage from '../../../components/AppPage';
import SafariFixedIonItem from '../../../components/SafariFixedIonItem';
import IonCenterContent from '../../../components/IonCenterContent';

const ViewSolutionPage = () => {
  const router = useRouter();
  const { homeworkId } = router.query;
  const { data: homework } = useOnErrorAlert(useHomework(homeworkId));
  const { data: user } = useMyData();
  const role = user?.role;
  const loggedIn = user ?? {};
  const { studentId } = router.query;
  const { data: student } = useOnErrorAlert(useUser(studentId));

  /* if (loggedIn) {

    if (isStudent(role) || openReviews?.length > 0) {
      tasks.push(<Tasks type="open-review" title="Open Reviews" homeworklist={openReviews} />);
    }}

  */

  return (
    <AppPage title="View Solution">
      <IonCenterContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              {'Homework Name: '}
              {homework?.homeworkName}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <SafariFixedIonItem>
                <IonLabel>
                  <strong>Student Submitting:</strong>
                  {student?.studentId}
                </IonLabel>
              </SafariFixedIonItem>

              <SafariFixedIonItem>
                <IonLabel>
                  <strong>Status:</strong>
                </IonLabel>
              </SafariFixedIonItem>
            </IonList>
            <SafariFixedIonItem>
              <IonLabel><strong>Submitted Solution</strong></IonLabel>
              <form method="get" action={`/api/homeworks/downloadTask?homeworkId=${homeworkId}`}>
                <IonButton type="submit">
                  Download
                  <input type="hidden" name="homeworkId" value={homeworkId ?? '-'} />
                </IonButton>
              </form>
            </SafariFixedIonItem>
            <SafariFixedIonItem>
              <IonLabel>
                <strong>Score:</strong>
                <strong>Out of:</strong>
              </IonLabel>
            </SafariFixedIonItem>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Reviews
            </IonCardTitle>
          </IonCardHeader>
          <IonList>
            <div style={{ width: '100%' }}>
              <SafariFixedIonItem>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonLabel className="ion-text-wrap" style={{ fontWeight: 'bold' }} position="float">ID</IonLabel>
                    </IonCol>
                    <IonCol>
                      <IonLabel className="ion-text-wrap" style={{ fontWeight: 'bold' }} position="float">Review </IonLabel>
                    </IonCol>
                    <IonCol>
                      <IonLabel className="ion-text-wrap" style={{ fontWeight: 'bold' }} position="float">Show Review</IonLabel>
                    </IonCol>
                    <div style={{ width: 51.88 }} />
                  </IonRow>
                </IonGrid>
              </SafariFixedIonItem>
            </div>
          </IonList>
        </IonCard>
        <IonToolbar style={{ position: 'sticky', bottom: 0 }}>
          <IonButton style={{ width: '100%' }} href=""> Add Review </IonButton>
          <IonButton style={{ width: '100%' }} href=""> Finish Audit</IonButton>
        </IonToolbar>
      </IonCenterContent>
    </AppPage>
  );
};

export default ViewSolutionPage;
