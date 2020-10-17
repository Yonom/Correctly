/* Ionic imports */
import { IonCard, IonCardContent, IonButton, IonLabel, IonList, IonTextarea, IonCardHeader, IonCardTitle, IonText, IonIcon } from '@ionic/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import moment from 'moment';

/* Custom components */
import { cloudUploadOutline, downloadOutline } from 'ionicons/icons';
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

const SubmitSolutionPage = () => {
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

  return (
    <AppPage title="Submit Solution">
      <IonCenterContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              {'Homework: '}
              {homework?.homeworkName}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <SafariFixedIonItem>
                <IonLabel>
                  <strong>Solution Upload Start:</strong>
                </IonLabel>
                <IonLabel>
                  {moment(homework?.doingStart).format('DD.MM.YYYY - HH:mm')}
                </IonLabel>
              </SafariFixedIonItem>

              <SafariFixedIonItem>
                <IonLabel>
                  <strong>Solution Upload End:</strong>
                </IonLabel>
                <IonLabel>
                  {moment(homework?.doingEnd).format('DD.MM.YYYY - HH:mm')}
                </IonLabel>
              </SafariFixedIonItem>
            </IonList>

            <SafariFixedIonItem>
              <IonIcon class="ion-padding" icon={downloadOutline} color="dark" />
              <IonLabel><h2>Download Task</h2></IonLabel>
              <form method="get" action={`/api/homeworks/downloadExerciseAssignment?homeworkId=${homeworkId}`}>
                <IonButton type="submit">
                  Download
                  <input type="hidden" name="homeworkId" value={homeworkId ?? '-'} />
                </IonButton>
              </form>
            </SafariFixedIonItem>

            <div className="ion-padding-top" />
            <IonLabel style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>Your Solution:</IonLabel>
            <IonText color="danger"> *</IonText>

            <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
              {homework?.solutionAllowedFormats?.includes('textfield') && (
              <>
                <IonController
                  control={control}
                  name="solutionText"
                  as={(
                    <IonTextarea maxLength="50000" rows="15" style={{ border: 'solid 1px', padding: 10 }} placeholder="Start typing here..." />
                  )}
                  rules={{ required: true, maxLength: 50000 }}
                />

                {errors.firstItem?.type === 'required' && 'Your input in the Textarea is required'}
                {errors.firstItem?.type === 'maxLength' && 'Your input exceed maxLength'}
              </>
              )}
              {homework?.solutionAllowedFormats?.filter((f) => f !== 'textfield').length > 0 && (
              <SafariFixedIonItem>
                <IonIcon class="ion-padding" icon={cloudUploadOutline} color="dark" />
                <IonLabel><h2>Solution</h2></IonLabel>
                <form method="get" action={`/api/homeworks/downloadExerciseAssignment?homeworkId=${homeworkId}`}>
                  <IonFileButtonController control={control} name="myfile">Upload</IonFileButtonController>
                </form>
              </SafariFixedIonItem>
              )}

              <div className="ion-text-center ion-padding-top">
                <SubmitButton>Submit Solution</SubmitButton>
              </div>

            </form>
          </IonCardContent>
        </IonCard>
      </IonCenterContent>
    </AppPage>
  );
};

export default SubmitSolutionPage;
