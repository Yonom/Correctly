/* Ionic imports */
import { IonLabel, IonList, IonText, IonSelect, IonSelectOption, IonIcon, IonInput } from '@ionic/react';

import { useForm } from 'react-hook-form';
import { saveOutline } from 'ionicons/icons';

/* Custom components */
import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';
import AppPage from '../../../components/AppPage';
import IonController, { IonFileButtonController } from '../../../components/IonController';
import IonCenterContent from '../../../components/IonCenterContent';

/* insert database function */
import { editHomework, useHomework } from '../../../services/homeworks';
import { toBase64 } from '../../../utils/fileUtils';
import SubmitButton from '../../../components/SubmitButton';

import { useOnErrorAlert, makeAPIErrorAlert, onSubmitError } from '../../../utils/errors';
import { makeToast, makeAlert } from '../../../components/GlobalNotifications';
import CoolDateTimeRangePicker from '../../../components/CoolDateTimeRangePicker';
import Expandable from '../../../components/Expandable';
import { arrayFromRange } from '../../../utils';
import { AUDIT_BY_LECTURERS, AUDIT_BY_MODULE_COORDINATOR, EFFORTS, ITS_OK_TO_FAIL, NOT_WRONG_RIGHT, ONE_REVIEWER, POINTS, TEXTFIELD, THRESHOLD_NA, TWO_REVIEWERS, ZERO_TO_ONE_HUNDRED } from '../../../utils/constants';
import SafariFixedIonItem from '../../../components/SafariFixedIonItem';
import { fileFormats } from '../../../utils/config';

export const FAKE_FILE = 'FAKE_FILE';

const EditHomeworkPage = () => {
  const { id } = useRouter().query;

  const { data: homework } = useOnErrorAlert(useHomework(id));

  const { control, handleSubmit, watch, reset } = useForm();
  useEffect(() => {
    reset({
      solutionRange: [homework?.solutionStart, homework?.solutionEnd],
      reviewRange: [homework?.reviewStart, homework?.reviewEnd],
      threshold: '-1',
      course: `${homework?.courseYearcode} ${homework?.courseTitle}`,

      taskFiles: homework?.taskFileNames ? FAKE_FILE : null,
      sampleSolutionFiles: homework?.sampleSolutionFileNames ? FAKE_FILE : null,
      evaluationScheme: homework?.evaluationSchemeFileNames ? FAKE_FILE : null,
      ...(homework || {}),
    });
  }, [reset, homework]);

  const onSubmit = async (data) => {
    try {
      const [solutionStart, solutionEnd] = data.solutionRange;
      const [reviewStart, reviewEnd] = data.reviewRange;

      if (solutionStart > solutionEnd || reviewStart > reviewEnd || reviewStart < solutionEnd) {
        return makeAlert({
          header: 'Datumseingabe fehlerhaft!',
          subHeader: 'Bitte stellen Sie sicher, dass das Startdatum des Bearbeitungszeitraums vor dem Enddatum liegt.',
        });
      }

      let base64Exercise;
      let exerciseName;
      let base64Solution;
      let base64Evaluation;
      let solutionName;
      let evaluationName;

      if (data.taskFiles !== FAKE_FILE) {
        if (!data.taskFiles?.length) {
          return makeAlert({
            header: 'Form error',
            message: 'You need to upload an assignment file.',
          });
        }
        base64Exercise = await toBase64(data.taskFiles[0]);
        exerciseName = data.taskFiles[0].name;
      }

      if (data.sampleSolutionFiles !== FAKE_FILE) {
        base64Solution = data.sampleSolutionFiles?.length ? await toBase64(data.sampleSolutionFiles[0]) : null;
        solutionName = data.sampleSolutionFiles?.length ? data.sampleSolutionFiles[0].name : null;
      }

      if (data.evaluationSchemeFiles !== FAKE_FILE) {
        base64Evaluation = data.evaluationSchemeFiles?.length ? await toBase64(data.evaluationSchemeFiles[0]) : null;
        evaluationName = data.evaluationSchemeFiles?.length ? data.evaluationSchemeFiles[0].name : null;
      }

      await editHomework(
        data.homeworkName,
        data.maxReachablePoints,
        data.evaluationVariant,
        data.reviewerCount,
        data.auditors,
        data.samplesize,
        data.threshold,
        data.solutionAllowedFormats,
        data.reviewAllowedFormats,
        solutionStart,
        solutionEnd,
        reviewStart,
        reviewEnd,
        base64Exercise,
        exerciseName,
        base64Solution,
        solutionName,
        base64Evaluation,
        evaluationName,
        id,
      );

      // Hier muss noch der Pfad angepasst werden
      Router.push('/home');

      return makeToast({
        header: 'Hausaufgabe erfolgreich bearbeitet!',
        subHeader: 'Jetzt zur Kurs-Seite gehen',
      });
    } catch (ex) {
      return makeAPIErrorAlert(ex);
    }
  };

  const [, minCorrecting] = watch('solutionRange') || [];
  const minSolution = 1;
  const reviewerCountIsB = watch('reviewerCount') === TWO_REVIEWERS;
  return (
    <AppPage title="Edit Homework">
      <IonCenterContent>
        <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
          <IonList lines="full" mode="md">
            <SafariFixedIonItem>
              <IonLabel>
                Homework Name
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="homeworkName"
                rules={{ required: true }}
                as={(
                  <IonInput class="ion-text-right" type="text" placeholder="" maxlength="64" />
                )}
              />
            </SafariFixedIonItem>

            <SafariFixedIonItem>
              <IonLabel>
                Course:
              </IonLabel>
              <IonController
                control={control}
                name="course"
                as={(
                  <IonInput class="ion-text-right" type="text" placeholder="" readonly="true" maxlength="64" />
                    )}
              />
            </SafariFixedIonItem>

            <SafariFixedIonItem>
              <IonText>Achievable Points</IonText>
              <IonText color="danger">*</IonText>
              <IonController
                control={control}
                name="maxReachablePoints"
                rules={{ required: true }}
                as={(
                  <IonInput class="ion-text-right" type="number" cancelText="Dismiss" placeholder="5" min="0" />
                )}
              />
            </SafariFixedIonItem>
            <Expandable header="Advanced Options">

              <SafariFixedIonItem>
                <IonLabel>
                  Evaluation Method
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="evaluationVariant"
                  rules={{ required: true }}
                  as={(
                    <IonSelect okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value={EFFORTS}>Has made efforts / has not made efforts</IonSelectOption>
                      <IonSelectOption value={POINTS}>Number of points</IonSelectOption>
                      <IonSelectOption value={ZERO_TO_ONE_HUNDRED}>0% - 100%</IonSelectOption>
                      <IonSelectOption value={NOT_WRONG_RIGHT}>not-wrong-correct-made</IonSelectOption>
                      <IonSelectOption value={ITS_OK_TO_FAIL}>not-wrong-correct-made - It&apos;s Okay to fail</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </SafariFixedIonItem>

              <SafariFixedIonItem>
                <IonLabel>
                  Review Method
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="reviewerCount"
                  rules={{ required: true }}
                  as={(
                    <IonSelect okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value={ONE_REVIEWER}>Method A</IonSelectOption>
                      <IonSelectOption value={TWO_REVIEWERS}>Method B</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </SafariFixedIonItem>
              <SafariFixedIonItem className="ion-padding">
                <i>
                  Jede abgegebene Hausaufgabe wird einem Korrektor zugeordnet, Sie bestimmen, wie viele (1, 2, 3...) der korrigierten Hausaufgaben ihnen zufällig zur Überprüfung zugeteilt werden (Stichprobe).
                  {
                    reviewerCountIsB && 'Variante B: Zusätzlich zur Stichprobe wird eine Aufgabe immer 2 Korrektoren zugeteilt. Sollte die Abweichung zwischen den korrigierten Hausaufgaben eine gewisse vom Dozenten festgelegte Schwelle (5% - 30%) überschreiten, dann bekommt der Dozent die korrigierte Hausaufgabe zur Überprüfung zugespielt.'
                  }
                </i>
              </SafariFixedIonItem>

              <SafariFixedIonItem>
                <IonLabel>
                  Who is responsible for verifying the reviews?
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="auditors"
                  rules={{ required: true }}
                  as={(
                    <IonSelect okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value={AUDIT_BY_LECTURERS}>Course Lecturers</IonSelectOption>
                      <IonSelectOption value={AUDIT_BY_MODULE_COORDINATOR}>Module Coordinator</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </SafariFixedIonItem>

              <SafariFixedIonItem>
                <IonLabel>
                  Samplesize
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="samplesize"
                  rules={{ required: true }}
                  as={(
                    <IonInput class="ion-text-right" type="number" cancelText="Dismiss" min="0" />
                  )}
                />
              </SafariFixedIonItem>

              <SafariFixedIonItem>
                <IonLabel>
                  Treshold (difference between reviews)
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="threshold"
                  rules={{ required: true }}
                  as={(
                    <IonSelect okText="Okay" cancelText="Dismiss" disabled={!reviewerCountIsB}>
                      <IonSelectOption value={THRESHOLD_NA}>N/A</IonSelectOption>
                      {arrayFromRange(5, 30).map((n) => (
                        <IonSelectOption value={n.toString()}>
                          {n}
                          %
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  )}
                />
              </SafariFixedIonItem>

              <SafariFixedIonItem>
                <IonLabel>
                  Allowed file formats (submission)
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="solutionAllowedFormats"
                  rules={{ required: true }}
                  as={(
                    <IonSelect multiple="true" okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value={TEXTFIELD}>Textfield</IonSelectOption>
                      {fileFormats.map((format) => {
                        return (
                          <IonSelectOption key={format} value={`.${format}`}>
                            .
                            {format}
                          </IonSelectOption>
                        );
                      })}
                    </IonSelect>
                  )}
                />
              </SafariFixedIonItem>

              <SafariFixedIonItem>
                <IonLabel>
                  Allowed file formats (review)
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="reviewAllowedFormats"
                  rules={{ required: true }}
                  as={(
                    <IonSelect multiple="true" okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value={TEXTFIELD}>Textfield</IonSelectOption>
                      {fileFormats.map((format) => {
                        return (
                          <IonSelectOption key={format} value={`.${format}`}>
                            .
                            {format}
                          </IonSelectOption>
                        );
                      })}
                    </IonSelect>
                  )}
                />
              </SafariFixedIonItem>
            </Expandable>

            <SafariFixedIonItem lines="none">
              <IonLabel style={{ fontWeight: 'bold' }}>
                Solution upload timeframe
                <IonText color="danger">*</IonText>
              </IonLabel>
            </SafariFixedIonItem>
            <div>
              <IonController
                name="solutionRange"
                control={control}
                rules={{ required: true }}
                as={
                  <CoolDateTimeRangePicker minimum={minSolution} />
              }
              />
            </div>

            <SafariFixedIonItem lines="none">
              <IonLabel style={{ fontWeight: 'bold' }}>
                Review upload timeframe
                <IonText color="danger">*</IonText>
              </IonLabel>
            </SafariFixedIonItem>
            <div>
              <IonController
                name="reviewRange"
                control={control}
                rules={{ required: true }}
                as={
                  <CoolDateTimeRangePicker minimum={minCorrecting - 1} defaultValue={minCorrecting} />
                }
              />
            </div>

            <SafariFixedIonItem>
              <IonLabel>
                Homework
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonFileButtonController fakeFileNames={[homework?.taskFileNames]} control={control} name="taskFiles">Upload</IonFileButtonController>
            </SafariFixedIonItem>
            <SafariFixedIonItem>
              <IonLabel>
                Sample solution
              </IonLabel>
              <IonFileButtonController fakeFileNames={[homework?.sampleSolutionFileNames]} control={control} name="sampleSolutionFiles">Upload</IonFileButtonController>
            </SafariFixedIonItem>
            <SafariFixedIonItem>
              <IonLabel>Evaluation scheme</IonLabel>
              <IonFileButtonController fakeFileNames={[homework?.evaluationSchemeFileNames]} control={control} name="evaluationSchemeFiles">Upload</IonFileButtonController>
            </SafariFixedIonItem>

          </IonList>

          <div className="ion-padding">
            <SubmitButton expand="block" class="ion-no-margin">
              <IonIcon icon={saveOutline} />
              <IonText>
                &nbsp;Save changes
              </IonText>

            </SubmitButton>
          </div>
        </form>
      </IonCenterContent>
    </AppPage>
  );
};

export default EditHomeworkPage;
