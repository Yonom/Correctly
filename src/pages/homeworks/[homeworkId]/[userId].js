/* Ionic imports */
import { IonCard, IonCardContent, IonButton, IonLabel, IonList, IonCol, IonCardHeader, IonGrid, IonToolbar, IonRow, IonCardTitle, IonItemGroup, IonItemDivider } from '@ionic/react';
import { useRouter } from 'next/router';

/* Utils */
import { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import { makeAPIErrorAlert, useOnErrorAlert } from '../../../utils/errors';

/* Services */
import { useHomework } from '../../../services/homeworks';
import { useUser } from '../../../services/users';
import { useSolution } from '../../../services/solutions';

/* Custom components */
import AppPage from '../../../components/AppPage';
import SafariFixedIonItem from '../../../components/SafariFixedIonItem';
import IonCenterContent from '../../../components/IonCenterContent';
import { makeToast, withLoading } from '../../../components/GlobalNotifications';
import { addLecturerReview } from '../../../services/reviews';
import { useHasAudit, resolveAudit } from '../../../services/audits';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-eclipse';

const getStatus = (s) => {
  if (s?.percentagegrade != null) {
    return 'Reviewed';
  }
  if (s) {
    return 'Submitted';
  }
  return '';
};

const ViewSolutionPage = () => {
  // initalize state variables:
  // ->  solutions & reviews
  const [solution, setSolution] = useState(undefined);
  const [reviews, setReviews] = useState([]);
  const [reviewsVisible, setReviewsVisible] = useState(false);

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
    if (percentageGrade == null) return 'Grade not yet available.';
    if (typeof (percentageGrade) !== 'undefined' && typeof (maxReachablePoints !== 'undefined')) {
      return (percentageGrade / 100) * maxReachablePoints;
    }
    return '';
  };

  // get course data from the api
  const { data: solutionData } = useOnErrorAlert(useSolution(homeworkId, userId));
  useEffect(() => {
    if (typeof solutionData !== 'undefined') {
      setSolution(solutionData.solution);
      setReviewsVisible(solutionData.reviewsVisible);
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
   * @param {object} review
   */
  function getReadableReviewType(review) {
    if (review.issystemreview) return 'System Review';
    if (review.islecturerreview) return 'Lecturer Review';
    return 'Student Review';
  }

  /**
   * @param {object} review
   */
  function getReviewerName(review) {
    if (review.issystemreview) return 'System';
    let reviewerString = '';
    if (review.reviewerfirstname) reviewerString += review.reviewerfirstname;
    if (review.reviewerlastname) reviewerString += ` ${review.reviewerlastname}`;
    return reviewerString;
  }

  // check if the review submission period has already started - otherwise the add review button will be disabled
  const canBeReviewed = solution?.hasdistributedreviews;

  // Review Items
  const reviewItems = reviewsVisible ? reviews.map((r) => {
    return (
      <IonRow key={r.reviewid}>
        <IonCol size="4">
          <IonLabel className="ion-text-wrap" position="float">{getReviewerName(r)}</IonLabel>
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
                      <IonLabel className="ion-text-wrap" style={{ fontWeight: 'bold' }} position="float">Reviewer</IonLabel>
                    </IonCol>
                    <IonCol size="4">
                      <IonLabel className="ion-text-wrap" style={{ fontWeight: 'bold' }} position="float">Review Type</IonLabel>
                    </IonCol>
                    <IonCol size="4">
                      <IonLabel className="ion-text-wrap" style={{ fontWeight: 'bold' }} position="float"> </IonLabel>
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
  const addReview = withLoading(async () => {
    const res = await addLecturerReview(solution.id);
    const reviewId = res?.id;
    if (reviewId !== null) return router.push(`/reviews/${reviewId}/submission`);
    return null;
  });

  // Finish Audit Button
  const finishAudit = withLoading(async () => {
    try {
      await resolveAudit(solution.id);
      makeToast({ message: 'Your audit has been finished successfully!' });
    } catch (ex) {
      return makeAPIErrorAlert(ex);
    }
    return null;
  });

  // the buttons to add a review or finish the audit - only shown if API
  // says so (which it does when user is a lecturer, module coordinator or
  // superuser)
  const reviewButtons = () => {
    if (reviewsVisible) {
      return (
        <div>
          <IonButton style={{ width: '100%' }} disabled={!canBeReviewed} onClick={addReview}> Add Review </IonButton>
          <IonButton style={{ width: '100%' }} disabled={!hasAudit} onClick={finishAudit}> Finish Audit</IonButton>
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
                  {getStatus(solution)}
                </IonLabel>
              </SafariFixedIonItem>
            </IonList>

            <SafariFixedIonItem lines="none">
              <IonLabel>
                <strong>Submitted Solution: </strong>
              </IonLabel>
              {solution?.solutionfilenames[0] && (
              <form method="get" action={solution ? `/api/solutions/downloadSolution?solutionId=${solution.id}` : null}>
                <IonItemGroup style={{ display: 'flex', alignItems: 'center' }}>
                  <IonLabel className="ion-padding-end">
                    {solution?.solutionfilenames.length > 1 ? `${solution?.solutionfilenames.length} files` : solution?.solutionfilenames ? solution?.solutionfilenames[0] : ''}
                  </IonLabel>
                  <IonButton type="submit">
                    Download
                    <input type="hidden" name="solutionId" value={solution ? solution.id : null} />
                  </IonButton>
                </IonItemGroup>
              </form>
              )}
            </SafariFixedIonItem>

            {solution?.solutioncomment && (
              <div className="ion-margin-start ion-margin-bottom" style={{ border: 'solid 1px', borderColor: 'black' }}>
                <AceEditor
                  mode="python"
                  theme="eclipse"
                  fontSize={14}
                  showPrintMargin
                  showGutter
                  readOnly
                  highlightActiveLine
                  value={solution?.solutioncomment}
                  maxLength="50000"
                  style={{ width: '100%' }}
                  setOptions={{
                    useWorker: false,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                />
              </div>
            )}
            <div className="ion-padding-start">
              <IonItemDivider style={{ minHeight: 0 }} />
            </div>
            <SafariFixedIonItem>
              <IonGrid style={{ width: '100%' }} className="ion-no-padding">
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
