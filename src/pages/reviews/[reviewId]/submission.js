import { IonInput, IonItemDivider, IonLabel, IonList, IonSelect, IonSelectOption, IonText, IonTextarea } from '@ionic/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import AceEditor from 'react-ace';
import AppPage from '../../../components/AppPage';
import IonCenterContent from '../../../components/IonCenterContent';
import { makeAPIErrorAlert, onSubmitError } from '../../../utils/errors';
import SubmitButton from '../../../components/SubmitButton';
import { useReview, changeReview } from '../../../services/reviews';
import IonController, { IonFileButtonController } from '../../../components/IonController';
import { getPercentageGrade } from '../../../utils/percentageGrade';
import { EFFORTS, ITS_OK_TO_FAIL, NOT_WRONG_RIGHT, POINTS, ZERO_TO_ONE_HUNDRED, NOT_DONE, WRONG, RIGHT, EFFORT, NO_EFFORT, TEXTFIELD } from '../../../utils/constants';
import { toBase64 } from '../../../utils/fileUtils';
import { makeAlert, makeToast, withLoading } from '../../../components/GlobalNotifications';
import SafariFixedIonItem from '../../../components/SafariFixedIonItem';
import makeConfirmAlert from '../../../utils/makeConfirmAlert';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-eclipse';

const SubmitReviewPage = () => {
  const router = useRouter();
  const { reviewId } = router.query;
  const { data: review } = useReview(reviewId);

  const { control, handleSubmit } = useForm();
  const onSubmit = withLoading(async ({ grade, reviewFiles, reviewComment }) => {
    try {
      await makeConfirmAlert('Once you submit, it is not possible to edit your submission.');
    } catch {
      // user cancelled request
      return null;
    }

    if (review?.islecturerreview && moment() < moment(review?.reviewstart)) {
      return makeAlert({
        header: 'Too early!',
        subHeader: 'You tried to submit before the beginning of the submission period for this review.',
      });
    }

    if (!review?.islecturerreview && moment() > moment(review?.reviewend)) {
      return makeAlert({
        header: 'Too late!',
        subHeader: 'You tried to submit after the deadline for this review.',
      });
    }

    try {
      const base64Documentation = reviewFiles ? await toBase64(reviewFiles[0]) : null;
      const reviewFileName = reviewFiles ? reviewFiles[0].name : null;
      const percentageGrade = getPercentageGrade(review, grade);
      await changeReview(reviewId, percentageGrade, base64Documentation, reviewFileName, reviewComment);

      router.push('/home');

      return makeToast({ message: 'Review successfully submitted!' });
    } catch (ex) {
      return makeAPIErrorAlert(ex);
    }
  });

  // check if the user is allowed to view the specific review and it is not submitted yet
  if (review?.issubmitted) {
    return (
      <AppPage title="Submit Review">
        <IonCenterContent>
          <IonLabel style={{ fontSize: 32 }}>
            Review has already been submitted.
          </IonLabel>
        </IonCenterContent>
      </AppPage>
    );
  }

  const allowedFileExtensions = review?.reviewallowedformats?.filter((f) => f !== TEXTFIELD);

  return (
    <AppPage title="Submit Review">
      <IonCenterContent>
        <IonList>
          <h1 className="ion-padding">
            Homework:
            {' '}
            {review?.homeworkname}
          </h1>
          <IonList>
            <SafariFixedIonItem>
              <IonLabel>
                <strong>Review Upload Start:</strong>
              </IonLabel>
              <IonLabel>
                {review && moment(review.reviewstart).format('DD.MM.YYYY - HH:mm')}
              </IonLabel>
            </SafariFixedIonItem>

            <SafariFixedIonItem>
              <IonLabel>
                <strong>Review Upload End:</strong>
              </IonLabel>
              <IonLabel>
                {review && moment(review.reviewend).format('DD.MM.YYYY - HH:mm')}
              </IonLabel>
            </SafariFixedIonItem>
          </IonList>

          <SafariFixedIonItem>
            <table style={{ width: '100%' }}>
              <tbody>
                {review?.taskfilenames && (
                <tr>
                  <td style={{ width: '50%' }}>
                    <IonLabel>
                      Homework (Task):
                    </IonLabel>
                  </td>
                  <td style={{ width: '50%' }}>
                    <a href={`/api/homeworks/downloadTask?homeworkId=${review.homeworkid}`} download>
                      {review?.taskfilenames}
                    </a>
                    <br />
                    <br />
                  </td>
                </tr>
                )}
                {review?.samplesolutionfilenames && (
                <tr>
                  <td style={{ width: '50%' }}>
                    <IonLabel>
                      Sample Solution:
                    </IonLabel>
                  </td>
                  <td style={{ width: '50%' }}>
                    <a href={`/api/homeworks/downloadSampleSolution?homeworkId=${review.homeworkid}`} download>
                      {review?.samplesolutionfilenames}
                    </a>
                    <br />
                    <br />
                  </td>
                </tr>
                )}
                {review?.evaluationschemefilenames && (
                <tr>
                  <td style={{ width: '50%' }}>
                    <IonLabel>
                      Evaluation Scheme:
                    </IonLabel>
                  </td>
                  <td style={{ width: '50%' }}>
                    <a href={`/api/homeworks/downloadEvaluationScheme?homeworkId=${review.homeworkid}`} download>
                      {review?.evaluationschemefilenames}
                    </a>
                    <br />
                    <br />
                  </td>
                </tr>
                )}
              </tbody>
            </table>
          </SafariFixedIonItem>
          <SafariFixedIonItem>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ width: '50%' }}>
                    <IonLabel>
                      Homework to be reviewed:
                    </IonLabel>
                  </td>
                  <td>
                    {review?.solutionfilenames && (
                    <a href={`/api/solutions/downloadSolution?solutionId=${review.solutionid}`} download>
                      {review?.solutionfilenames}
                    </a>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </SafariFixedIonItem>
          {review?.solutioncomment && (
            <>
              <div className="ion-margin-start ion-margin-bottom" style={{ border: 'solid 1px', borderColor: 'black' }}>
                <AceEditor
                  mode="python"
                  theme="eclipse"
                  fontSize={14}
                  showPrintMargin
                  showGutter
                  readOnly
                  highlightActiveLine
                  value={review?.solutioncomment}
                  maxLength="50000"
                  style={{ width: '100%' }}
                  setOptions={{
                    useWorker: false,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                />
              </div>

              <div className="ion-padding-start">
                <IonItemDivider style={{ minHeight: 0 }} />
              </div>
            </>
          )}
          <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
            <SafariFixedIonItem className="ion-margin-start ion-no-padding">
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%' }}>
                      <IonLabel>
                        <IonText>Grading:</IonText>
                        {' '}
                        <IonText color="danger">*</IonText>
                      </IonLabel>
                    </td>
                    <td style={{ width: '50%' }}>
                      {review?.evaluationvariant === EFFORTS && (
                      <IonController
                        control={control}
                        name="grade"
                        rules={{ required: true }}
                        as={(
                          <IonSelect multiple="false" okText="Okay" cancelText="Cancel" className="ion-no-padding">
                            <IonSelectOption value={EFFORT}>Has made efforts</IonSelectOption>
                            <IonSelectOption value={NO_EFFORT}>Has not made efforts</IonSelectOption>
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
                          <IonSelect multiple="false" okText="Okay" cancelText="Cancel" className="ion-no-padding">
                            <IonSelectOption value={NOT_DONE}>Was not done</IonSelectOption>
                            <IonSelectOption value={WRONG}>Wrong</IonSelectOption>
                            <IonSelectOption value={RIGHT}>Correct</IonSelectOption>
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
                          <IonSelect multiple="false" okText="Okay" cancelText="Cancel" className="ion-no-padding">
                            <IonSelectOption value={NOT_DONE}>Was not done</IonSelectOption>
                            <IonSelectOption value={WRONG}>Wrong</IonSelectOption>
                            <IonSelectOption value={RIGHT}>Correct</IonSelectOption>
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
                          <IonInput
                            class="ion-text-right"
                            type="number"
                            cancelText="Cancel"
                            placeholder="number of points"
                            maxlength="10"
                            max={review?.maxreachablepoints}
                            min={0}
                          />
                  )}
                      />
                      )}
                      {review?.evaluationvariant === ZERO_TO_ONE_HUNDRED && (
                      <IonController
                        control={control}
                        name="grade"
                        rules={{ required: true }}
                        as={(
                          <IonInput
                            class="ion-text-right"
                            type="number"
                            cancelText="Cancel"
                            placeholder="percentage grade"
                            max="100"
                            min="0"
                          />
                  )}
                      />
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </SafariFixedIonItem>

            {review?.reviewallowedformats?.includes(TEXTFIELD) && (
              <>
                <SafariFixedIonItem lines="none">
                  <IonLabel>
                    <IonText>Review Comment:</IonText>
                  </IonLabel>
                </SafariFixedIonItem>
                <div className="ion-padding-start">
                  {' '}
                  <div style={{ border: 'solid 1px' }} className="ion-padding-end ion-padding-start">
                    <IonController
                      control={control}
                      name="reviewComment"
                      as={<IonTextarea autoGrow maxlength={10000} placeholder=" " />}
                    />
                    <br />
                  </div>
                </div>
                <div className="ion-padding-start">
                  <IonItemDivider style={{ minHeight: 16 }} />
                </div>
              </>
            )}
            {allowedFileExtensions?.length > 0 && (
              <div className="ion-padding-end ion-padding-start">
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '50%' }}>
                        <IonLabel>
                          <IonText>Grading Upload:</IonText>
                          <IonText color="danger"> *</IonText>
                        </IonLabel>
                      </td>
                      <td style={{ width: '50%' }}>
                        <IonFileButtonController rules={{ required: true }} accept={allowedFileExtensions.join()} control={control} name="reviewFiles">Upload</IonFileButtonController>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="ion-padding-start">
              <IonItemDivider style={{ minHeight: 0 }} />
              <br />
              <SubmitButton>Submit review</SubmitButton>
            </div>
          </form>

        </IonList>
      </IonCenterContent>
    </AppPage>
  );
};

export default SubmitReviewPage;
