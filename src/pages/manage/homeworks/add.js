/* Ionic imports */
import { IonLabel, IonItem, IonList, IonText, IonSelect, IonDatetime, IonSelectOption, IonIcon, IonInput } from '@ionic/react';

import { useForm } from 'react-hook-form';
import { cloudUploadOutline } from 'ionicons/icons';

/* Custom components */
import AppPage from '../../../components/AppPage';
import IonController, { IonFileButtonController } from '../../../components/IonController';
import IonCenterContent from '../../../components/IonCenterContent';

/* insert database function */
import { addHomework } from '../../../services/homework';
import { toBase64 } from '../../../utils/fileUtils';
import SubmitButton from '../../../components/SubmitButton';
import { useMyEditableCourses } from '../../../services/courses';

import { useOnErrorAlert, makeAPIErrorAlert } from '../../../utils/errors';
import { makeToast, makeAlert } from '../../../components/GlobalNotifications';

const AddHomework = () => {
  const { control, handleSubmit } = useForm();
  const { data: courses } = useOnErrorAlert(useMyEditableCourses());

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = (new Date()).getFullYear();

  const minYear = `${yyyy}-${mm}-${dd}`;
  const maxYear = (new Date()).getFullYear() + 3;

  let backgroundColorDate = '#ffffff';

  const onSubmit = async (data) => {
    try {
      const doingStart = new Date(`${data.doingStartDate.split('T')[0]} ${data.doingStartTime.split('T')[1].substring(0, 5)}`);
      const doingEnd = new Date(`${data.doingEndDate.split('T')[0]} ${data.doingEndTime.split('T')[1].substring(0, 5)}`);
      const correctingStart = new Date(`${data.correctingStartDate.split('T')[0]} ${data.correctingStartTime.split('T')[1].substring(0, 5)}`);
      const correctingEnd = new Date(`${data.correctingEndDate.split('T')[0]} ${data.correctingEndTime.split('T')[1].substring(0, 5)}`);

      if (doingStart > doingEnd || correctingStart > correctingEnd || correctingStart < doingEnd) {
        makeAlert({
          header: 'Datumseingabe fehlerhaft!',
          subHeader: 'Bitte stellen Sie sicher, dass das Startdatum des Bearbeitungszeitraums vor dem Enddatum liegt.',
        });
        backgroundColorDate = '#cccccc';
        return;
      }

      const base64Exercise = await toBase64(data.exerciseAssignment[0]);
      const base64Solution = await toBase64(data.modelSolution[0]);
      const base64Evaluation = data.evaluationScheme ? await toBase64(data.evaluationScheme[0]) : null;

      await addHomework(
        data.homeworkName,
        data.courses,
        data.maxReachablePoints,
        data.requireCorrectingDocumentationFile,
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
        data.modelSolution[0].name,
        base64Evaluation,
        data.evaluationScheme[0].name,
      );
      makeToast({
        header: 'Hausaufgabe erfolgreich hinzugefügt!',
        subHeader: 'Jetzt zur Kurs-Seite gehen',
      });
    } catch (ex) {
      makeAPIErrorAlert(ex);
    }
  };

  return (
    <AppPage title="Hausaufgaben Upload">
      <IonCenterContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonList lines="full" mode="md">

            <IonItem>
              <IonLabel>
                Name der Hausaufgabe:
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="homeworkName"
                rules={{ required: true }}
                as={(
                  <IonInput class="ion-text-right" type="text" cancelText="Dismiss" placeholder="Demo Quiz 27-10-2021" maxlength="64" />
                  )}
              />
            </IonItem>

            <IonItem>
              <IonLabel>
                Auswahl der Kurse
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="courses"
                rules={{ required: true }}
                as={(
                  <IonSelect value="dummy" multiple="true" okText="Okay" cancelText="Dismiss">
                    {courses?.map(({ courseId, yearCode, title }) => (
                      <IonSelectOption value={courseId} key={courseId}>
                        {yearCode}
                        {' '}
                        {title}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                  )}
              />
            </IonItem>

            <IonItem>
              <IonText> Maximal Erreichbare Punktzahl</IonText>
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

            <IonItem>
              <IonLabel>
                Soll eine Korrekturdokumentationsdatei hochgeladen werden?
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="requireCorrectingDocumentationFile"
                rules={{ required: true }}
                as={(
                  <IonSelect value="dummy" okText="Okay" cancelText="Dismiss">
                    <IonSelectOption value="1">Ja</IonSelectOption>
                    <IonSelectOption value="0">Nein</IonSelectOption>
                  </IonSelect>
                  )}
              />
            </IonItem>

            <IonItem>
              <IonLabel>
                Auswahl der Bewertungsvariante
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="evaluationVariant"
                rules={{ required: true }}
                as={(
                  <IonSelect okText="Okay" cancelText="Dismiss">
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
                Korrekturvariante
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="correctionVariant"
                rules={{ required: true }}
                as={(
                  <IonSelect okText="Okay" cancelText="Dismiss">
                    <IonSelectOption value="correct-one"> Variante A (Default): Jede abgegebene Hausaufgabe wird einem Korrektor zugeordnet, Sie bestimmen, wie viele (1, 2, 3...) der korrigierten Hausaufgaben ihnen zufällig zur Überprüfung zugeteilt werden (Stichprobe).</IonSelectOption>
                    <IonSelectOption value="correct-two"> Variante B: Zusätzlich zur Stichprobe wird eine Aufgabe immer 2 Korrektoren zugeteilt. Sollte die Abweichung zwischen den korrigierten Hausaufgaben eine gewisse vom Dozenten festgelegte Schwelle (5% - 30%) überschreiten, dann bekommt der Dozent die korrigierte Hausaufgabe zur Überprüfung zugespielt.</IonSelectOption>
                  </IonSelect>
                  )}
              />
            </IonItem>

            <IonItem>
              <IonLabel>
                Wer wird die Überprüfung der Korrekturen vornehmen?
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="correctionValidation"
                rules={{ required: true }}
                as={(
                  <IonSelect okText="Okay" cancelText="Dismiss">
                    <IonSelectOption value="lecturers">Die Lehrenden der Kurse</IonSelectOption>
                    <IonSelectOption value="coordinator">Vom Modulkoordinator</IonSelectOption>
                  </IonSelect>
                  )}
              />
            </IonItem>

            <IonItem>
              <IonLabel>
                Stichprobengröße
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="samplesize"
                rules={{ required: true }}
                as={(
                  <IonInput class="ion-text-right" type="number" cancelText="Dismiss" placeholder="5" min="0" />
                  )}
              />
            </IonItem>

            <IonItem>
              <IonLabel>
                Kritische Schwelle (Differenz zwischen den Punktzahlen der Korrekturen)
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="threshold"
                rules={{ required: true }}
                as={(
                  <IonSelect okText="Okay" cancelText="Dismiss">
                    <IonSelectOption value="5">5%</IonSelectOption>
                    <IonSelectOption value="6">6%</IonSelectOption>
                    <IonSelectOption value="7">7%</IonSelectOption>
                    <IonSelectOption value="8">8%</IonSelectOption>
                    <IonSelectOption value="9">9%</IonSelectOption>
                    <IonSelectOption value="10">10%</IonSelectOption>
                    <IonSelectOption value="11">11%</IonSelectOption>
                    <IonSelectOption value="12">12%</IonSelectOption>
                    <IonSelectOption value="13">13%</IonSelectOption>
                    <IonSelectOption value="14">14%</IonSelectOption>
                    <IonSelectOption value="15">15%</IonSelectOption>
                    <IonSelectOption value="16">16%</IonSelectOption>
                    <IonSelectOption value="17">17%</IonSelectOption>
                    <IonSelectOption value="18">18%</IonSelectOption>
                    <IonSelectOption value="19">19%</IonSelectOption>
                    <IonSelectOption value="20">20%</IonSelectOption>
                    <IonSelectOption value="21">21%</IonSelectOption>
                    <IonSelectOption value="22">22%</IonSelectOption>
                    <IonSelectOption value="23">23%</IonSelectOption>
                    <IonSelectOption value="24">24%</IonSelectOption>
                    <IonSelectOption value="25">25%</IonSelectOption>
                    <IonSelectOption value="26">26%</IonSelectOption>
                    <IonSelectOption value="27">27%</IonSelectOption>
                    <IonSelectOption value="28">28%</IonSelectOption>
                    <IonSelectOption value="29">29%</IonSelectOption>
                    <IonSelectOption value="30">30%</IonSelectOption>
                  </IonSelect>
                  )}
              />
            </IonItem>

            <IonItem>
              <IonLabel>
                Zulässige Dateiformate für die Abgabe
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="solutionAllowedFormats"
                rules={{ required: true }}
                as={(
                  <IonSelect multiple="true" okText="Okay" cancelText="Dismiss">
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
                Zulässige Dateiformate für die Korrekturdokumentation
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="correctionAllowedFormats"
                rules={{ required: true }}
                as={(
                  <IonSelect multiple="true" okText="Okay" cancelText="Dismiss">
                    <IonSelectOption value="pdf">.pdf</IonSelectOption>
                    <IonSelectOption value="py">.py</IonSelectOption>
                    <IonSelectOption value="jpeg">.jpeg</IonSelectOption>
                    <IonSelectOption value="docx">.docx</IonSelectOption>
                  </IonSelect>
                  )}
              />
            </IonItem>

            <IonItem lines="none">
              <IonLabel style={{ fontWeight: 'bold' }}>Bearbeitungs-Zeitraum</IonLabel>
            </IonItem>

            <IonItem lines="none" control={control} name="doingStartDate">
              <IonLabel>
                Start Datum
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="doingStartDate"
                rules={{ required: true }}
                as={(
                  <IonDatetime name="doingStartDate" min={minYear} max={maxYear} />
                  )}
              />
            </IonItem>
            {/*
            <input type="hidden" name="doingStartTime" value="9999-99-99T00:00:01.000Z" />

                */}
            <IonItem control={control}>
              <IonLabel>
                Start Zeit
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="doingStartTime"
                rules={{ required: true }}
                as={(
                  <IonDatetime displayFormat="hh:mm A" control={control} name="doingStartTime" />
                  )}
              />
            </IonItem>

            <IonItem lines="none" style={{ backgroundColor: backgroundColorDate }}>
              <IonLabel>
                End Datum
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="doingEndDate"
                rules={{ required: true }}
                as={(
                  <IonDatetime name="doingEndDate" style={{ backgroundColor: backgroundColorDate }} min={minYear} max={maxYear} />
                  )}
              />
            </IonItem>

            <IonItem>
              <IonLabel>
                End Zeit
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="doingEndTime"
                rules={{ required: true }}
                as={(
                  <IonDatetime displayFormat="hh:mm A" control={control} name="doingEndTime" />
                  )}
              />
            </IonItem>

            <IonItem lines="none">
              <IonLabel style={{ fontWeight: 'bold' }}>Korrektur-Zeitraum</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>
                Start Datum
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="correctingStartDate"
                rules={{ required: true }}
                as={(
                  <IonDatetime control={control} name="correctingStartDate" min={minYear} max={maxYear} />
                  )}
              />
            </IonItem>

            <IonItem>
              <IonLabel>
                Start Zeit
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="correctingStartTime"
                rules={{ required: true }}
                as={(
                  <IonDatetime displayFormat="hh:mm A" control={control} name="correctingStartTime" />
                  )}

              />
            </IonItem>

            <IonItem lines="none">
              <IonLabel>
                End Datum
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="correctingEndDate"
                rules={{ required: true }}
                as={(
                  <IonDatetime control={control} name="correctingEndDate" min={minYear} max={maxYear} />
                  )}
              />
            </IonItem>

            <IonItem>
              <IonLabel>
                End Zeit
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="correctingEndTime"
                rules={{ required: true }}
                as={(
                  <IonDatetime displayFormat="hh:mm A" control={control} name="correctingEndTime" />
                  )}
              />
            </IonItem>

            <IonItem>
              <IonLabel>
                Hausaufgaben Datei-Upload
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonFileButtonController rules={{ required: true }} control={control} name="exerciseAssignment">Hochladen</IonFileButtonController>
            </IonItem>
            <IonItem>
              <IonLabel>
                Musterlösung Datei-Upload
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonFileButtonController rules={{ required: true }} control={control} name="modelSolution">Hochladen</IonFileButtonController>
            </IonItem>
            <IonItem>
              <IonLabel>Bewertung Datei-Upload</IonLabel>
              <IonFileButtonController rules={{ required: false }} control={control} name="evaluationScheme">Hochladen</IonFileButtonController>
            </IonItem>

          </IonList>

          <div className="ion-padding">
            <SubmitButton expand="block" class="ion-no-margin">
              <IonIcon icon={cloudUploadOutline} />
              <IonText>
                &nbsp;Hochladen
              </IonText>

            </SubmitButton>
          </div>
        </form>
      </IonCenterContent>
    </AppPage>
  );
};

export default AddHomework;
