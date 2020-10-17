/* Ionic imports */
import { IonCard, IonCardContent, IonButton, IonLabel, IonList, IonTextarea } from '@ionic/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

/* Custom components */
import AppPage from '../../../components/AppPage';
import { makeToast } from '../../../components/GlobalNotifications';
import IonCenterContent from '../../../components/IonCenterContent';
import IonController, { IonFileButtonController } from '../../../components/IonController';
import SafariFixedIonItem from '../../../components/SafariFixedIonItem';
import SubmitButton from '../../../components/SubmitButton';

/* Services */
import { useHomework } from '../../../services/homeworks';
import { addSolution } from '../../../services/solutions';

/* Utils */
import { makeAPIErrorAlert, onSubmitError, useOnErrorAlert } from '../../../utils/errors';
import { toBase64 } from '../../../utils/fileUtils';

const AddSolution = () => {
  const { control, handleSubmit, errors } = useForm();
  const router = useRouter();
  const { homeworkId } = router.query;

  const { data: homework } = useOnErrorAlert(useHomework(homeworkId));

  const onSubmit = async ({ solutionText, myfile }) => {
    try {
      const myfileBase64 = myfile ? await toBase64(myfile[0]) : null;
      const solutionFilename = myfile ? myfile[0].name : null;

      await addSolution(
        homeworkId,
        myfileBase64,
        solutionFilename,
        solutionText,
      );
      await router.push('/home');
      return makeToast({
        header: 'Solution successfully submitted!',
        subHeader: 'You can go back to the previous page now.',
      });
    } catch (ex) {
      return makeAPIErrorAlert(ex);
    }
  };

  const HomeworkLabel = 'Homework: ';
  const HomeworkName = homework?.homeworkName;
  const startDate = homework?.doingStart.toString().substring(0, 10);
  const startTime = homework?.doingStart.toString().substring(11, 19);
  const endDate = homework?.doingEnd.toString().substring(0, 10);
  const endTime = homework?.doingEnd.toString().substring(11, 19);
  const HomeworkDownload = 'Download Homework';
  const TextareaTitle = 'Solution';
  const SolutionUpload = 'Update Solution';
  const Submit = 'Submit Solution';

  return (
    <AppPage title="Solution Upload">
      <IonCenterContent>
        <IonCard>
          <IonCardContent>
            <IonLabel>
              {HomeworkLabel}
              {HomeworkName}
            </IonLabel>

            <IonList>
              <SafariFixedIonItem>
                <IonLabel>
                  <strong>Start</strong>
                </IonLabel>
                <IonLabel>
                  {startDate}
                </IonLabel>
                <IonLabel>
                  {startTime}
                </IonLabel>
              </SafariFixedIonItem>

              <SafariFixedIonItem>
                <IonLabel>
                  <strong>End</strong>
                </IonLabel>
                <IonLabel>
                  {endDate}
                </IonLabel>
                <IonLabel>
                  {endTime}
                </IonLabel>
              </SafariFixedIonItem>
            </IonList>

            <form method="get" action={`/api/homeworks/downloadExerciseAssignment?homeworkId=${homeworkId}`}>
              <IonButton type="submit">
                <IonLabel>{HomeworkDownload}</IonLabel>
                <input type="hidden" name="homeworkId" value={homeworkId ?? '-'} />
              </IonButton>
            </form>

            <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
              {homework?.solutionAllowedFormats?.includes('textfield') && (
              <>
                <IonController
                  control={control}
                  name="solutionText"
                  as={(
                    <IonTextarea maxLength="50000" rows="15">
                      {TextareaTitle}
                    </IonTextarea>
                  )}
                  rules={{ required: true, maxLength: 50000 }}
                />

                {errors.firstItem?.type === 'required' && 'Your input in the Textarea is required'}
                {errors.firstItem?.type === 'maxLength' && 'Your input exceed maxLength'}
              </>
              )}
              {homework?.solutionAllowedFormats?.filter((f) => f !== 'textfield').length > 0 && (
                <IonFileButtonController control={control} name="myfile">{SolutionUpload}</IonFileButtonController>
              )}
              <div className="ion-text-center">
                <SubmitButton>{Submit}</SubmitButton>
              </div>

            </form>
          </IonCardContent>
        </IonCard>
      </IonCenterContent>
    </AppPage>
  );
};

export default AddSolution;
