/* Ionic imports */
import { IonCard, IonCardContent, IonButton, IonLabel, IonList, IonCol, IonCardHeader, IonGrid, IonToolbar, IonRow, IonCardTitle } from '@ionic/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

/* Utils */
import { useState, useEffect } from 'react';
import { useOnErrorAlert } from '../../../utils/errors';

/* Services */
import { useHomework } from '../../../services/homeworks';
import { useUser } from '../../../services/users';
import { useSolution } from '../../../services/solutions';

/* Custom components */
import AppPage from '../../../components/AppPage';
import SafariFixedIonItem from '../../../components/SafariFixedIonItem';
import IonCenterContent from '../../../components/IonCenterContent';

const ViewSolutionPage = () => {
  // initialize router
  const [solution, setSolution] = useState(undefined);
  const [reviews, setReviews] = useState([]);
  const [reviewsVisible, setReviewsVisible] = useState(false);

  // initialize router
  const router = useRouter();
  const { homeworkId } = router.query;
  const { data: homework } = useOnErrorAlert(useHomework(homeworkId));
  // const { data: user } = useMyData();
  const { userId } = router.query;
  const { data: student } = useOnErrorAlert(useUser(userId));

  // get course data from the api
  const { data: solutionData } = useOnErrorAlert(useSolution(homeworkId, userId));
  useEffect(() => {
    if (typeof solutionData !== 'undefined') {
      setSolution(solutionData.solution);
      if (solutionData.reviews !== undefined) setReviews(solutionData.reviews);
      setReviewsVisible(solutionData.reviewsVisible);
    }
  }, [solutionData]);

  /**
   * @param review
   */
  function getReadableReviewType(review) {
    if (review.issystemreview) return 'System Review';
    if (review.islecturerreview) return 'Lecturer Review';
    return 'Student Review';
  }

  const reviewItems = reviewsVisible ? reviews.map((r) => {
    return (
      <IonRow>
        <IonCol>
          <IonLabel className="ion-text-wrap" position="float">{r.reviewerstudentid ? r.reviewerstudentid : null}</IonLabel>
        </IonCol>
        <IonCol>
          <IonLabel className="ion-text-wrap" position="float">
            {getReadableReviewType(r)}
          </IonLabel>
        </IonCol>
        <IonCol>
          <IonButton href={`../../reviews/${r.reviewid}`}>Show Review</IonButton>
        </IonCol>
        <div style={{ width: 51.88 }} />
      </IonRow>
    );
  }) : null;

  const reviewCard = (children) => {
    if (reviewsVisible) {
      return (
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
                      <IonLabel className="ion-text-wrap" style={{ fontWeight: 'bold' }} position="float">Show</IonLabel>
                    </IonCol>
                    <div style={{ width: 51.88 }} />
                    {children}
                  </IonRow>
                </IonGrid>
              </SafariFixedIonItem>
            </div>
          </IonList>
        </IonCard>
      );
    } return null;
  };

  // the buttons to add a review or finish the audit - only shown if API
  // says so (which it does when user is a lecturer, module coordinator or
  // superuser)
  const reviewButtons = () => {
    if (reviewsVisible) {
      return (
        <div>
          <IonButton style={{ width: '100%' }} href=""> Add Review </IonButton>
          <IonButton style={{ width: '100%' }} href=""> Finish Audit</IonButton>
        </div>
      );
    } return null;
  };

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
              <form method="get" action={solution ? `/api/solutions/downloadSolution?solutionId=${solution.id}` : null}>
                <IonButton type="submit">
                  Download
                  <input type="hidden" name="solutionId" value={solution ? solution.id : null} />
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
        {reviewCard(reviewItems)}
        <IonToolbar style={{ position: 'sticky', bottom: 0 }}>
          {reviewButtons()}
        </IonToolbar>
      </IonCenterContent>
    </AppPage>
  );
};

export default ViewSolutionPage;
