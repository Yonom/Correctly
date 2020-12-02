/* Ionic imports */
import { IonCard, IonCardContent, IonButton, IonLabel, IonList, IonCardHeader, IonCardTitle, IonText, IonIcon } from '@ionic/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import moment from 'moment';

/* Custom components */
import { cloudUploadOutline, downloadOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import AceEditor from 'react-ace';
import AppPage from '../../../components/AppPage';
import { makeAlert, makeToast, withLoading } from '../../../components/GlobalNotifications';
import IonCenterContent from '../../../components/IonCenterContent';
import { IonFileButtonController } from '../../../components/IonController';
import SafariFixedIonItem from '../../../components/SafariFixedIonItem';
import SubmitButton from '../../../components/SubmitButton';

/* Services */
import { useHomework } from '../../../services/homeworks';
import { addSolution } from '../../../services/solutions';

/* Utils */
import { makeAPIErrorAlert, onSubmitError, useOnErrorAlert } from '../../../utils/errors';
import { toBase64 } from '../../../utils/fileUtils';
import { TEXTFIELD } from '../../../utils/constants';
import makeConfirmAlert from '../../../utils/makeConfirmAlert';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-eclipse';
import 'ace-builds/src-noconflict/ext-language_tools';

const SubmitSolutionPage = () => {
  const { control, handleSubmit, errors } = useForm();
  const router = useRouter();
  const { homeworkId } = router.query;
  const { data: homework } = useOnErrorAlert(useHomework(homeworkId));

  const [userCode, setUserCode] = useState('');

  const onSubmit = withLoading(async ({ myfile }) => {
    try {
      await makeConfirmAlert(`After submitting, you can edit your submission until the ${moment(homework?.solutionEnd).format('DD.MM.YYYY - HH:mm')}.`);
    } catch {
      // user cancelled request
      return null;
    }

    try {
      const myfileBase64 = myfile ? await toBase64(myfile[0]) : null;
      const solutionFilename = myfile ? myfile[0].name : null;

      if (moment() > moment(homework?.solutionEnd)) {
        return makeAlert({
          header: 'Too late!',
          subHeader: 'You tried to submit after the deadline for this homework.',
        });
      }

      await addSolution(
        homeworkId,
        myfileBase64,
        solutionFilename,
        userCode,
      );

      if (document.referrer === '') {
        router.push('/home');
      } else {
        router.back();
      }

      return makeToast({
        header: 'Solution successfully submitted! ✅😩🔥🤙',
        subHeader: 'You can go back to the previous page now. 🔙👋👀',
      });
    } catch (ex) {
      return makeAPIErrorAlert(ex);
    }
  });

  const allowedFileExtensions = homework?.solutionAllowedFormats?.filter((f) => f !== TEXTFIELD);

  /**
   * @param {string} newValue
   */
  function onChange(newValue) {
    setUserCode(newValue);
  }

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
                  {moment(homework?.solutionStart).format('DD.MM.YYYY - HH:mm')}
                </IonLabel>
              </SafariFixedIonItem>

              <SafariFixedIonItem>
                <IonLabel>
                  <strong>Solution Upload End:</strong>
                </IonLabel>
                <IonLabel>
                  {moment(homework?.solutionEnd).format('DD.MM.YYYY - HH:mm')}
                </IonLabel>
              </SafariFixedIonItem>
            </IonList>

            <SafariFixedIonItem>
              <IonIcon class="ion-padding" icon={downloadOutline} color="dark" />
              <IonLabel><h2>Download Task</h2></IonLabel>
              <form method="get" action={`/api/homeworks/downloadTask?homeworkId=${homeworkId}`}>
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
              {homework?.solutionAllowedFormats?.includes(TEXTFIELD) && (
              <>
                <div style={{ border: 'solid 1px', borderColor: 'black' }}>
                  <AceEditor
                    placeholder="Start typing here..."
                    mode="python"
                    theme="eclipse"
                    name="blah2"
                    fontSize={14}
                    onChange={onChange}
                    showPrintMargin
                    showGutter
                    highlightActiveLine
                    value={userCode}
                    maxLength="50000"
                    style={{ width: '100%' }}
                    setOptions={{
                      useWorker: false,
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: false,
                      showLineNumbers: true,
                      tabSize: 2,
                    }}
                  />
                </div>
                {errors.firstItem?.type === 'required' && 'Your input in the textarea is required'}
                {errors.firstItem?.type === 'maxLength' && 'Your input exceed maxLength'}
              </>
              )}
              {allowedFileExtensions?.length > 0 && (
              <SafariFixedIonItem>
                <IonIcon class="ion-padding" icon={cloudUploadOutline} color="dark" />
                <IonLabel><h2>Solution</h2></IonLabel>
                <IonFileButtonController rules={{ required: true }} accept={allowedFileExtensions.join()} control={control} name="myfile">Upload</IonFileButtonController>
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
