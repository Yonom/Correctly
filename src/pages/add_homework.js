/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonList, IonText, IonSelect, IonDatetime, IonSelectOption, IonIcon } from '@ionic/react';

import { useForm } from 'react-hook-form';
import { cloudUploadOutline } from 'ionicons/icons';

/* Custom components */
import AppPage from '../components/AppPage';
import IonController, { IonFileButtonController } from '../components/IonController';
import IonCenterContent from '../components/IonCenterContent';

/* insert database function */
import { addHomework } from '../services/homework';
import { toBase64 } from '../utils/fileUtils';

export default () => {
  const { control, handleSubmit } = useForm();

  const minYear = (new Date()).getFullYear();
  const maxYear = (new Date()).getFullYear() + 3;

  const onSubmit = async (data) => {
    const doingStart = new Date(`${data.doingStartDate.split('T')[0]} ${data.doingStartTime.split('T')[1].substring(0, 5)}`);
    const doingEnd = new Date(`${data.doingEndDate.split('T')[0]} ${data.doingEndTime.split('T')[1].substring(0, 5)}`);
    const correctingStart = new Date(`${data.correctingStartDate.split('T')[0]} ${data.correctingStartTime.split('T')[1].substring(0, 5)}`);
    const correctingEnd = new Date(`${data.correctingEndDate.split('T')[0]} ${data.correctingEndTime.split('T')[1].substring(0, 5)}`);

    const base64Exercise = await toBase64(data.exercise[0]);
    const base64Solution = await toBase64(data.solution[0]);
    const base64Evaluation = data.evaluation ? await toBase64(data.evaluation[0]) : null;

    await addHomework(
      base64Exercise,
      base64Solution,
      base64Evaluation,
      doingStart,
      doingEnd,
      correctingStart,
      correctingEnd,
      data.dataFormat,
      data.correctingType,
      data.correctingAmountStudent,
      data.correctingAmountProf,
      data.criticalEvaluation,
    );
  };

  return (
    <AppPage title="Hausaufgaben Upload" footer="Correctly">
      <IonContent>
        <IonCenterContent innerStyle={{ padding: '10%' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonList lines="full">
              <IonItem>
                <IonLabel position="stacked">
                  Hausaufgaben Datei-Upload
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonFileButtonController rules={{ required: true }} control={control} name="exercise">Hochladen</IonFileButtonController>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                  Musterlösung Datei-Upload
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonFileButtonController rules={{ required: true }} control={control} name="solution">Hochladen</IonFileButtonController>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                  Bewertung Datei-Upload
                </IonLabel>
                <IonFileButtonController control={control} name="evaluation">Hochladen</IonFileButtonController>
              </IonItem>

              <IonItem>
                <IonText position="stacked">
                  Auswahl der Kurse
                  <IonText color="danger">*</IonText>
                </IonText>
                <IonController
                  control={control}
                  name="courses"
                  rules={{ required: true }}
                  as={(
                    <IonSelect value="dummy" okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value="course-one">Kurs 1</IonSelectOption>
                      <IonSelectOption value="course-two">Kurs 2</IonSelectOption>
                      <IonSelectOption value="course-three">Kurs 3</IonSelectOption>
                      <IonSelectOption value="course-four">Kurs 4</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </IonItem>

              <IonItem>
                <IonText position="stacked">
                  Auswahl der Lehrenden
                  <IonText color="danger">*</IonText>
                </IonText>
                <IonController
                  control={control}
                  name="users"
                  rules={{ required: true }}
                  as={(
                    <IonSelect value="dummy" okText="Okay" name="hair" cancelText="Dismiss">
                      <IonSelectOption value="teacher-one">Lehrer 1</IonSelectOption>
                      <IonSelectOption value="teacher-two">Lehrer 2</IonSelectOption>
                      <IonSelectOption value="teacher-three">Lehrer 3</IonSelectOption>
                      <IonSelectOption value="teacher-four">Lehrer 4</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </IonItem>

              <IonItem>
                <IonText position="stacked">
                  Bearbeitungs-Zeitraum
                  <IonText color="danger">*</IonText>
                </IonText>
                <IonText />
              </IonItem>
              <IonItem control={control} name="doingStartDate">
                <IonLabel position="stacked">
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
              <IonItem control={control}>
                <IonLabel position="stacked">
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
              <IonItem>
                <IonLabel position="stacked">
                  End Datum
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="doingEndDate"
                  rules={{ required: true }}
                  as={(
                    <IonDatetime name="doingEndDate" min={minYear} max={maxYear} />
                  )}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
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

              <IonItem>
                <IonText position="stacked">
                  Korrektur-Zeitraum
                  <IonText color="danger">*</IonText>
                </IonText>
                <IonText />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
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
                <IonLabel position="stacked">
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
              <IonItem>
                <IonLabel position="stacked">
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
                <IonLabel position="stacked">
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
                <IonText position="stacked">
                  Zulässige Dateiformate
                  <IonText color="danger">*</IonText>
                </IonText>
                <IonController
                  control={control}
                  name="dataFormat"
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

              {/* still needs to be clarified with fachlich */}
              <IonItem>
                <IonText position="stacked">
                  Auswahl des Korrekturformats
                  <IonText color="danger">*</IonText>
                </IonText>
                <IonController
                  control={control}
                  name="correctingType"
                  rules={{ required: true }}
                  as={(
                    <IonSelect okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value="correct-one">Eins</IonSelectOption>
                      <IonSelectOption value="correct-two">Zwei</IonSelectOption>
                      <IonSelectOption value="correct-three">Drei</IonSelectOption>
                      <IonSelectOption value="correct-four">Vier</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </IonItem>

              <IonItem>
                <IonText position="stacked">
                  Auswahl der Korrekturen pro Lösung
                  <IonText color="danger">*</IonText>
                </IonText>
                <IonController
                  control={control}
                  name="correctingAmountStudent"
                  rules={{ required: true }}
                  as={(
                    <IonSelect value="hi" okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value={1}>1</IonSelectOption>
                      <IonSelectOption value={2}>2</IonSelectOption>
                      <IonSelectOption value={3}>3</IonSelectOption>
                      <IonSelectOption value={4}>4</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </IonItem>

              <IonItem>
                <IonText position="stacked">
                  Anzahl der zu überprüfenden Korrekturen
                  <IonText color="danger">*</IonText>
                </IonText>
                <IonController
                  control={control}
                  name="correctingAmountProf"
                  rules={{ required: true }}
                  as={(
                    <IonSelect okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value={1}>1</IonSelectOption>
                      <IonSelectOption value={2}>2</IonSelectOption>
                      <IonSelectOption value={3}>3</IonSelectOption>
                      <IonSelectOption value={4}>4</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </IonItem>

              <IonItem>
                <IonText position="stacked">Kritische Schwelle bei Abweichungen zwischen mehreren Korrekturen zu einer Lösung</IonText>
                <IonText color="danger">*</IonText>
                <IonController
                  control={control}
                  name="criticalEvaluation"
                  rules={{ required: true }}
                  as={(
                    <IonSelect okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value={0.1}>10%</IonSelectOption>
                      <IonSelectOption value={0.2}>20%</IonSelectOption>
                      <IonSelectOption value={0.3}>30%</IonSelectOption>
                      <IonSelectOption value={0.4}>40%</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </IonItem>

            </IonList>

            <div className="ion-padding">
              <IonButton type="submit" expand="block" class="ion-no-margin">
                <IonIcon icon={cloudUploadOutline} />
                Hochladen
              </IonButton>
            </div>
          </form>
        </IonCenterContent>
      </IonContent>
    </AppPage>
  );
};
