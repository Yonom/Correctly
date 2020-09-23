/* Ionic imports */
import { IonLabel, IonItem, IonList, IonText, IonSelect, IonSelectOption, IonIcon, IonInput, IonItemDivider } from '@ionic/react';

import { useForm } from 'react-hook-form';
import { home, saveOutline } from 'ionicons/icons';

/* Custom components */
import Router from 'next/router';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AppPage from '../../../components/AppPage';
import IonController, { IonFileButtonController } from '../../../components/IonController';
import IonCenterContent from '../../../components/IonCenterContent';

/* insert database function */
import { editHomework, useHomework } from '../../../services/homework';
import { toBase64 } from '../../../utils/fileUtils';
import SubmitButton from '../../../components/SubmitButton';
import { useMyEditableCourses } from '../../../services/courses';

import { useOnErrorAlert, makeAPIErrorAlert, onSubmitError } from '../../../utils/errors';
import { makeToast, makeAlert } from '../../../components/GlobalNotifications';
import CoolDateTimeRangePicker from '../../../components/CoolDateTimeRangePicker';
import Expandable from '../../../components/Expandable';
import { arrayFromRange } from '../../../utils';

const EditHomework = () => {
  const homeworkId = useRouter().query.homeworkId || '592189434739884033';

  const { data: homework } = useOnErrorAlert(useHomework(homeworkId));

  const { control, handleSubmit, watch, reset } = useForm();
  useEffect(() => {
    reset({
      doingRange: [homework?.doingStart, homework?.doingEnd],
      correctingRange: [homework?.correctingStart, homework?.correctingEnd],

      // TODO
      // exerciseAssignment: homework?.exerciseassignment[0],
      // modelSolution: homework?.modelsolution[0],
      // evaluationScheme: homework?.evaluationscheme[0],
      ...(homework || {}),
    });
  }, [homework, reset]);
  const { data: courses } = useOnErrorAlert(useMyEditableCourses());

  const onSubmit = async (data) => {
    try {
      const [doingStart, doingEnd] = data.doingRange;
      const [correctingStart, correctingEnd] = data.correctingRange;

      if (doingStart > doingEnd || correctingStart > correctingEnd || correctingStart < doingEnd) {
        return makeAlert({
          header: 'Datumseingabe fehlerhaft!',
          subHeader: 'Bitte stellen Sie sicher, dass das Startdatum des Bearbeitungszeitraums vor dem Enddatum liegt.',
        });
      }

      const base64Exercise = await toBase64(data.exerciseAssignment[0]);
      const base64Solution = data.modelSolution ? await toBase64(data.modelSolution[0]) : null;
      const base64Evaluation = data.evaluationScheme ? await toBase64(data.evaluationScheme[0]) : null;
      const solutionName = data.modelSolution ? data.modelSolution[0].name : null;
      const evaluationName = data.evaluationScheme ? data.evaluationScheme[0].name : null;

      await editHomework(
        data.homeworkName,
        data.maxReachablePoints,
        data.evaluationVariant,
        data.correctionVariant,
        data.correctionValidation,
        data.samplesize,
        data.threshold,
        data.solutionAllowedFormats,
        data.correctionAllowedFormats,
        doingStart,
        doingEnd,
        correctingStart,
        correctingEnd,
        base64Exercise,
        data.exerciseAssignment[0].name,
        base64Solution,
        solutionName,
        base64Evaluation,
        evaluationName,
        homeworkId,
      );

      Router.push('/manage/homeworks');

      return makeToast({
        header: 'Hausaufgabe erfolgreich hinzugefügt!',
        subHeader: 'Jetzt zur Kurs-Seite gehen',
      });
    } catch (ex) {
      return makeAPIErrorAlert(ex);
    }
  };

  const [, minCorrecting] = watch('doingRange') || [];
  const correctionVariantIsB = watch('correctionVariant') === 'correct-two';
  return (
    <AppPage title="Hausaufgaben Upload">
      <IonCenterContent>
        <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
          <IonList lines="full" mode="md">
            <IonItem>
              <IonLabel>
                Homework Name
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="homeworkName"
                rules={{ required: true }}
                as={(
                  <IonInput class="ion-text-right" type="text" cancelText="Dismiss" placeholder="Programming Assignment 1" maxlength="64" />
                )}
              />
            </IonItem>

            <IonItem>
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
            </IonItem>
            <Expandable header="Advanced Options">
              <IonItem>
                <IonLabel>
                  Enable review documetation
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="requireCorrectingDocumentationFile"
                  rules={{ required: true }}
                  as={(
                    <IonSelect value="dummy" okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value="1">Yes</IonSelectOption>
                      <IonSelectOption value="0">No</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </IonItem>

              <IonItem>
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
                      <IonSelectOption value="efforts">Has made efforts / has not made efforts</IonSelectOption>
                      <IonSelectOption value="points">Punkteanzahl</IonSelectOption>
                      <IonSelectOption value="zeroToOnehundred">0% - 100%</IonSelectOption>
                      <IonSelectOption value="notWrongRight">nicht-falsch-richtig-gemacht</IonSelectOption>
                      <IonSelectOption value="itsOkayToFail">nicht-falsch-richtig-gemacht - It&apos;s Okay to fail</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </IonItem>

              <IonItem>
                <IonLabel>
                  Review Method
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="correctionVariant"
                  rules={{ required: true }}
                  as={(
                    <IonSelect okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value="correct-one">Method A</IonSelectOption>
                      <IonSelectOption value="correct-two">Method B</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </IonItem>
              <IonItem className="ion-padding">
                <i>
                  Jede abgegebene Hausaufgabe wird einem Korrektor zugeordnet, Sie bestimmen, wie viele (1, 2, 3...) der korrigierten Hausaufgaben ihnen zufällig zur Überprüfung zugeteilt werden (Stichprobe).
                  {
                    correctionVariantIsB && 'Variante B: Zusätzlich zur Stichprobe wird eine Aufgabe immer 2 Korrektoren zugeteilt. Sollte die Abweichung zwischen den korrigierten Hausaufgaben eine gewisse vom Dozenten festgelegte Schwelle (5% - 30%) überschreiten, dann bekommt der Dozent die korrigierte Hausaufgabe zur Überprüfung zugespielt.'
                  }
                </i>
              </IonItem>

              <IonItem>
                <IonLabel>
                  Who is responsible for verifying the reviews?
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="correctionValidation"
                  rules={{ required: true }}
                  as={(
                    <IonSelect okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value="lecturers">Course Lecturers</IonSelectOption>
                      <IonSelectOption value="coordinator">Module Coordinator</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </IonItem>

              <IonItem>
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
              </IonItem>

              <IonItem>
                <IonLabel>
                  Treshold (difference between correction reviews)
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="threshold"
                  rules={{ required: true }}
                  as={(
                    <IonSelect okText="Okay" cancelText="Dismiss" disabled={!correctionVariantIsB}>
                      <IonSelectOption value="-1">N/A</IonSelectOption>
                      {arrayFromRange(5, 30).map((n) => (
                        <IonSelectOption value={n.toString()}>
                          {n}
                          %
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  )}
                />
              </IonItem>

              <IonItem>
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
                      <IonSelectOption value="textfield">Textfield</IonSelectOption>
                      <IonSelectOption value="pdf">.pdf</IonSelectOption>
                      <IonSelectOption value="py">.py</IonSelectOption>
                      <IonSelectOption value="jpeg">.jpeg</IonSelectOption>
                      <IonSelectOption value="docx">.docx</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </IonItem>

              <IonItem>
                <IonLabel>
                  Allowed file formats (review)
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="correctionAllowedFormats"
                  rules={{ required: true }}
                  as={(
                    <IonSelect multiple="true" okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value="textfield">Textfield</IonSelectOption>
                      <IonSelectOption value="pdf">.pdf</IonSelectOption>
                      <IonSelectOption value="py">.py</IonSelectOption>
                      <IonSelectOption value="jpeg">.jpeg</IonSelectOption>
                      <IonSelectOption value="docx">.docx</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </IonItem>
            </Expandable>

            <IonItem lines="none">
              <IonLabel style={{ fontWeight: 'bold' }}>
                Solution upload timeframe
                <IonText color="danger">*</IonText>
              </IonLabel>
            </IonItem>
            <div>
              <IonController
                name="doingRange"
                control={control}
                rules={{ required: true }}
                as={CoolDateTimeRangePicker}
              />
            </div>

            <IonItemDivider />

            <IonItem lines="none">
              <IonLabel style={{ fontWeight: 'bold' }}>
                Review upload timeframe
                <IonText color="danger">*</IonText>
              </IonLabel>
            </IonItem>
            <div>
              <IonController
                name="correctingRange"
                control={control}
                rules={{ required: true }}
                as={
                  <CoolDateTimeRangePicker disabled={!minCorrecting} minimum={minCorrecting} defaultValue={minCorrecting} />
                }
              />
            </div>
            <IonItemDivider />

            <IonItem>
              <IonLabel>
                Homework
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonFileButtonController rules={{ required: true }} control={control} name="exerciseAssignment">Upload</IonFileButtonController>
            </IonItem>
            <IonItem>
              <IonLabel>
                Sample solution
              </IonLabel>
              <IonFileButtonController control={control} name="modelSolution">Upload</IonFileButtonController>
            </IonItem>
            <IonItem>
              <IonLabel>Evaluation scheme</IonLabel>
              <IonFileButtonController control={control} name="evaluationScheme">Upload</IonFileButtonController>
            </IonItem>

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

export default EditHomework;
