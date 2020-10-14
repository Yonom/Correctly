import { IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonText, IonTextarea } from '@ionic/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import AppPage from '../../../components/AppPage';
import CoolDateTimeRangePicker from '../../../components/CoolDateTimeRangePicker';
import IonCenterContent from '../../../components/IonCenterContent';
import { onSubmitError } from '../../../utils/errors';
import SubmitButton from '../../../components/SubmitButton';
import { useReview, changeReview } from '../../../services/reviews';
import IonController, { IonFileButtonController } from '../../../components/IonController';
import { EFFORTS, ITS_OK_TO_FAIL, NOT_WRONG_RIGHT, POINTS, ZERO_TO_ONE_HUNDRED } from '../../../utils/percentageGradeConst';

const SubmitReview = () => {
  const router = useRouter();
  const { reviewId } = router.query;
  const { data: review } = useReview(reviewId);

  const { control, handleSubmit } = useForm();
  const onSubmit = () => {
    changeReview();
  };

  // check if the user is allowed to view the specific review and it is not submitted yet
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

          <IonItem lines="none">
            <IonLabel>
              <IonText>Review upload timeframe</IonText>
            </IonLabel>
          </IonItem>
          <CoolDateTimeRangePicker disabled value={[review?.correctingstart, review?.correctingend]} />
          <IonItem lines="none">
            <IonLabel>
              <IonText>Download</IonText>
            </IonLabel>
          </IonItem>
          <IonItem>
            <table style={{ width: '100%' }}>
              <tbody>
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
                    <br />
                    <br />
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
                    <br />
                    <br />
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
                    <br />
                    <br />
                  </td>
                </tr>
                )}
              </tbody>
            </table>
          </IonItem>
          <IonItem lines="none">
            <IonLabel>
              <IonText>Homework to be reviewed</IonText>
            </IonLabel>
          </IonItem>
          {review?.solutionfilename && (
            <a href={`/api/solution/downloadSolutionFileName?homeworkId${review.homeworkid}`} download className="ion-padding-start">
              {review?.solutionfilename}
            </a>
          )}
          <br />
          <br />
          {review?.solutioncomment && (
            <div className="ion-padding-start">
              <div style={{ borderStyle: 'solid' }} className="ion-padding-end ion-padding-start">
                <p>{review?.solutioncomment}</p>
              </div>
            </div>
          )}
          <IonItem>
            <br />
          </IonItem>
          <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
            <IonItem lines="none">
              <IonLabel>
                <IonText>Final grading</IonText>
              </IonLabel>
              {review?.evaluationvariant === EFFORTS && (
                <IonController
                  control={control}
                  name="grade"
                  rules={{ required: true }}
                  as={(
                    <IonSelect multiple="false" okText="Okay" cancelText="Cancel">
                      <IonSelectOption value="hasMadeEfforts">Has made efforts</IonSelectOption>
                      <IonSelectOption value="hasNotMadeEfforts">Has not made efforts</IonSelectOption>
                    </IonSelect>
                  )}
                />
              )}
              {review?.evaluationvariant === ITS_OK_TO_FAIL && (
                <IonController
                  control={control}
                  name="grade"
                  rules={{ required: true }}
                  as={(
                    <IonSelect multiple="false" okText="Okay" cancelText="Cancel">
                      <IonSelectOption value="wasNotDone">Was not done</IonSelectOption>
                      <IonSelectOption value="wrong">Wrong</IonSelectOption>
                      <IonSelectOption value="correct">Correct</IonSelectOption>
                    </IonSelect>
                  )}
                />
              )}
              {review?.evaluationvariant === NOT_WRONG_RIGHT && (
                <IonController
                  control={control}
                  name="grade"
                  rules={{ required: true }}
                  as={(
                    <IonSelect multiple="false" okText="Okay" cancelText="Cancel">
                      <IonSelectOption value="wasNotDone">Was not done</IonSelectOption>
                      <IonSelectOption value="wrong">Wrong</IonSelectOption>
                      <IonSelectOption value="correct">Correct</IonSelectOption>
                    </IonSelect>
                  )}
                />
              )}
              {review?.evaluationvariant === POINTS && (
                <IonController
                  control={control}
                  name="grade"
                  rules={{ required: true }}
                  as={(
                    <IonInput class="ion-text-right" type="number" cancelText="Cancel" placeholder="number of points" maxlength="10" />
                  )}
                />
              )}
              {review?.evaluationvariant === ZERO_TO_ONE_HUNDRED && (
                <IonController
                  control={control}
                  name="grade"
                  rules={{ required: true }}
                  as={(
                    <IonInput class="ion-text-right" type="number" cancelText="Cancel" placeholder="percentage grade" maxlength="10" />
                  )}
                />
              )}
            </IonItem>

            {review?.correctionallowedformats?.includes('textfield') && (
            <div className="ion-padding-start">
              {' '}
              <br />
              <div style={{ borderStyle: 'solid' }} className="ion-padding-end ion-padding-start">
                <IonController
                  control={control}
                  name="documentationcomment"
                  as={<IonTextarea autoGrow maxlength={10000} style={{ '--padding-start': 1 }} placeholder=" " />}
                />
                <br />
              </div>
            </div>
            )}
            {review?.correctionallowedformats?.filter((f) => f !== 'textfield').length > 0 && (
              <div className="ion-padding-end ion-padding-start">
                <br />
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '50%' }}>
                        <IonLabel>
                          <IonText>Grading upload</IonText>
                        </IonLabel>
                      </td>
                      <td style={{ width: '50%' }}>
                        <IonFileButtonController rules={{ required: true }} control={control} name="documentation">Upload</IonFileButtonController>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <IonItem>
              <br />
            </IonItem>
            <br />
            <SubmitButton>Submit review</SubmitButton>
          </form>

        </IonList>
      </IonCenterContent>
    </AppPage>
  );
};

export default SubmitReview;
