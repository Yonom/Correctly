import { IonItem, IonItemDivider, IonLabel, IonList, IonText } from '@ionic/react';
import { useRouter } from 'next/router';
import AppPage from '../../../components/AppPage';
import CoolDateTimeRangePicker from '../../../components/CoolDateTimeRangePicker';
import IonCenterContent from '../../../components/IonCenterContent';
import { useTestReview } from '../../../services/reviews';

const SubmitReview = () => {
  const router = useRouter();
  const { reviewId } = router.query;
  const { data: review } = useTestReview(reviewId);

  // check if the user is allowed to view the specific review and it is not submited yet
  if (review?.issubmitted === true) {
    return (
      <AppPage title="Submit a review">
        <IonCenterContent>
          <IonLabel style={{ fontSize: 32 }}>
            Review was not accessible
          </IonLabel>
        </IonCenterContent>
      </AppPage>
    );
  }

  return (
    <AppPage title="Submit a review">
      <IonCenterContent>
        <IonList>
          <IonItem>
            <IonLabel>
              {review?.homeworkname}
            </IonLabel>
          </IonItem>
          <IonLabel>
            <IonText>Review upload timeframe</IonText>
          </IonLabel>
          <br />
          <br />
          <CoolDateTimeRangePicker disabled value={[review?.correctingstart, review?.correctingend]} />
          <IonItemDivider />
          <IonLabel>
            <IonText>Download</IonText>
          </IonLabel>
          <table style={{ width: '100%' }}>
            {review?.exerciseassignmentname && (
              <tr>
                <td style={{ width: '50%' }}>
                  <IonLabel>
                    Homework (Task):
                  </IonLabel>
                </td>
                <td style={{ width: '50%' }}>
                  <a href="/api/homeworks/downloadExerciseAssignment" download>
                    {review?.exerciseassignmentname}
                  </a>
                </td>
              </tr>
            )}
            {review?.modelsolutionname && (
              <tr>
                <td style={{ width: '50%' }}>
                  <IonLabel>
                    Sample Solution:
                  </IonLabel>
                </td>
                <td style={{ width: '50%' }}>
                  <a href="/api/homeworks/downloadSampleSolution" download>
                    {review?.modelsolutionname}
                  </a>
                </td>
              </tr>
            )}
            {review?.evaluationschemename && (
              <tr>
                <td style={{ width: '50%' }}>
                  <IonLabel>
                    Sample Solution:
                  </IonLabel>
                </td>
                <td style={{ width: '50%' }}>
                  <a href="/api/homeworks/downloadEvaluationSchemeName" download>
                    {review?.evaluationschemename}
                  </a>
                </td>
              </tr>
            )}
          </table>
          <IonItemDivider />
        </IonList>
      </IonCenterContent>
    </AppPage>
  );
};

export default SubmitReview;
