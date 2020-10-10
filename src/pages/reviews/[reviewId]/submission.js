import { IonItem, IonItemDivider, IonLabel, IonList, IonText, IonTextarea } from '@ionic/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import AppPage from '../../../components/AppPage';
import CoolDateTimeRangePicker from '../../../components/CoolDateTimeRangePicker';
import IonCenterContent from '../../../components/IonCenterContent';
import { onSubmitError } from '../../../utils/errors';
import SubmitButton from '../../../components/SubmitButton';
import { useTestReview } from '../../../services/reviews';
import { IonFileButtonController } from '../../../components/IonController';

const SubmitReview = () => {
  const router = useRouter();
  const { reviewId } = router.query;
  const { data: review } = useTestReview(reviewId);

  const { control, handleSubmit } = useForm();
  const onSubmit = () => {
    // submit button was clicked, do something
  };

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
                  <a href={`/api/homeworks/downloadExerciseAssignment?homeworkId${review.homeworkid}`} download>
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
                  <a href={`/api/homeworks/downloadModelSolution?homeworkId${review.homeworkid}`} download>
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
                  <a href={`/api/homeworks/downloadEvaluationScheme?homeworkId${review.homeworkid}`} download>
                    {review?.evaluationschemename}
                  </a>
                </td>
              </tr>
            )}
          </table>
          <IonItemDivider />
          <IonLabel>
            <IonText>Homework to be reviewed</IonText>
          </IonLabel>
          <br />
          <br />
          {review?.solutionfilename && (
            <a href={`"/api/solution/downloadSolutionFileName?homeworkId${review.homeworkid}`} download>
              {review?.solutionfilename}
            </a>
          )}
          <br />
          <br />
          {review?.solutioncomment && (
            <p>{review?.solutioncomment}</p>
          )}
          <br />
          <br />
          <IonItemDivider />

          <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
            Hier kommt das drop down hin

            {review?.correctionallowedformats?.includes('textfield') && (
              <IonTextarea autoGrow maxlength={1000} style={{ '--padding-start': 0 }} />
            )}

            {review?.correctionallowedformats?.filter((f) => f !== 'textfield').count && (
              <>
                <IonLabel>
                  <IonText>Grading upload</IonText>
                </IonLabel>
                <IonFileButtonController rules={{ required: true }} control={control} name="exerciseAssignment">Upload</IonFileButtonController>
              </>
            )}
            <IonItemDivider />
            <SubmitButton>Submit review</SubmitButton>
          </form>

        </IonList>
      </IonCenterContent>
    </AppPage>
  );
};

export default SubmitReview;
