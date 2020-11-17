/* Ionic imports */
import { IonCard, IonCardContent, IonButton, IonLabel, IonList, IonCol, IonCardHeader, IonGrid, IonToolbar, IonRow, IonCardTitle, IonLoading } from '@ionic/react';
import { useRouter } from 'next/router';

/* Utils */
import { useState, useEffect } from 'react';
import { makeAPIErrorAlert, useOnErrorAlert } from '../../../utils/errors';

/* Services */
import { useHomework } from '../../../services/homeworks';
import { useUser } from '../../../services/users';
import { useSolution } from '../../../services/solutions';

/* Custom components */
import AppPage from '../../../components/AppPage';
import SafariFixedIonItem from '../../../components/SafariFixedIonItem';
import IonCenterContent from '../../../components/IonCenterContent';
import { makeToast } from '../../../components/GlobalNotifications';

import { addLecturerReview } from '../../../services/reviews';
import { useHasAudit, resolveAudit } from '../../../services/audits';

const ViewSolutionPage = () => {
  // initalize state variables:
  // ->  solutions & reviews
  const [solution, setSolution] = useState(undefined);
  const [reviews, setReviews] = useState([]);
  const [reviewsVisible, setReviewsVisible] = useState(false);
  // ->  loading state for IonLoading component
  const [updateLoading, setUpdateLoading] = useState(false);
  // ->  'enabled state' for 'finish solution button': if no solution audit
  //      has been created, it should be disabled
  const [hasAudit, setHasAudit] = useState(false);

  const [score, setScore] = useState('');

  // initialize router
  const router = useRouter();
  const { homeworkId } = router.query;
  const { data: homework } = useOnErrorAlert(useHomework(homeworkId));
  const { userId } = router.query;
  const { data: student } = useOnErrorAlert(useUser(userId));

  const getScoreString = (percentageGrade, maxReachablePoints) => {
    if (typeof (percentageGrade) !== 'undefined' && typeof (maxReachablePoints !== 'undefined')) {
      return percentageGrade * maxReachablePoints;
    }
    return '';
  };

  // get course data from the api
  const { data: solutionData } = useOnErrorAlert(useSolution(homeworkId, userId));
  useEffect(() => {
    if (typeof solutionData !== 'undefined') {
      setSolution(solutionData.solution);
      if (solutionData.reviews !== undefined) {
        setReviews(solutionData.reviews);
      }
      setScore(getScoreString(solutionData.solution.percentagegrade, homework?.maxReachablePoints));
    }
  }, [solutionData, homework]);

  // get course data from the api
  const { data: hasAuditData } = useOnErrorAlert(useHasAudit(solution?.id));
  useEffect(() => {
    if (typeof hasAuditData !== 'undefined') {
      setHasAudit(hasAuditData.hasaudit);
    }
  }, [hasAuditData]);

  /**
   * @param review
   */
  function getReadableReviewType(review) {
    if (review.issystemreview) return 'System Review';
    if (review.islecturerreview) return 'Lecturer Review';
    return 'Student Review';
  }
  // Review Items
  const reviewItems = reviewsVisible ? reviews.map((r) => {
    return (
      <IonRow>
        <IonCol size="4">
          <IonLabel className="ion-text-wrap" position="float">{r.reviewerstudentid ? r.reviewerstudentid : null}</IonLabel>
        </IonCol>
        <IonCol size="4">
          <IonLabel className="ion-text-wrap" position="float">
            {getReadableReviewType(r)}
          </IonLabel>
        </IonCol>
        <IonCol size="4">
          <IonButton position="float" style={{ width: '100%' }} href={`../../reviews/${r.reviewid}`}>Show</IonButton>
        </IonCol>
      </IonRow>
    );
  }) : null;
  // Review Card
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
                  <IonRow style={{ width: '100%' }}>
                    <IonCol size="4">
                      <IonLabel className="ion-text-wrap" style={{ fontWeight: 'bold' }} position="float">ID</IonLabel>
                    </IonCol>
                    <IonCol size="4">
                      <IonLabel className="ion-text-wrap" style={{ fontWeight: 'bold' }} position="float">Review </IonLabel>
                    </IonCol>
                    <IonCol size="4">
                      <IonLabel className="ion-text-wrap" style={{ fontWeight: 'bold' }} position="float">Show</IonLabel>
                    </IonCol>
                    <div style={{ width: 51.88 }} />
                  </IonRow>
                  {children}
                </IonGrid>
              </SafariFixedIonItem>
            </div>
          </IonList>
        </IonCard>
      );
    } return null;
  };
  // Add Review Button
  const addReview = async () => {
    setUpdateLoading(true);
    const res = await addLecturerReview(solution.id);
    const reviewId = res?.id;
    setUpdateLoading(false);
    if (reviewId !== null) return router.push(`/reviews/${reviewId}/submission`);
    return null;
  };
  // Finish Audit Button
  const finishAudit = async () => {
    setUpdateLoading(true);
    try {
      await resolveAudit(solution.id);
      makeToast({ message: 'Your audit has been finished successfully!' });
      setUpdateLoading(false);
    } catch (ex) {
      setUpdateLoading(false);
      return makeAPIErrorAlert(ex);
    }
    return null;
  };

  // the buttons to add a review or finish the audit - only shown if API
  // says so (which it does when user is a lecturer, module coordinator or
  // superuser)
  const reviewButtons = () => {
    if (reviewsVisible) {
      return (
        <div>
          <IonButton style={{ width: '100%' }} onClick={addReview}> Add Review </IonButton>
          <IonButton style={{ width: '100%' }} disabled={!hasAudit} onClick={finishAudit}> Finish Audit</IonButton>
        </div>
      );
    } return null;
  };
  return (
    <AppPage title="View Solution">
      <IonCenterContent>
        <IonLoading isOpen={updateLoading} />
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <strong>{'Homework Name: '}</strong>
              {homework?.homeworkName}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <SafariFixedIonItem>
                <IonLabel>
                  <strong>Student Submitting: </strong>
                  {student?.firstName}
                  {' '}
                  {student?.lastName}
                </IonLabel>
              </SafariFixedIonItem>

              <SafariFixedIonItem>
                <IonLabel>
                  <strong>Status: </strong>
                  {solution?.id ? 'Submitted' : 'Graded'}
                </IonLabel>
              </SafariFixedIonItem>
            </IonList>
            <SafariFixedIonItem>
              <IonLabel>
                <strong>Submitted Solution: </strong>
              </IonLabel>
              <form method="get" action={solution ? `/api/solutions/downloadSolution?solutionId=${solution.id}` : null}>
                <IonButton type="submit">
                  Download
                  <input type="hidden" name="solutionId" value={solution ? solution.id : null} />
                </IonButton>
              </form>
            </SafariFixedIonItem>
            <SafariFixedIonItem>
              <IonGrid style={{ width: '100%' }}>
                <IonRow style={{ width: '100%' }}>
                  <IonCol size="6">
                    <strong>Score: </strong>
                    {score}
                  </IonCol>
                  <IonCol size="6">
                    <strong>Out of: </strong>
                    {homework?.maxReachablePoints}
                  </IonCol>
                </IonRow>
              </IonGrid>
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
