/* Ionic imports */
import { IonLabel, IonItem, IonList, IonText, IonSelect, IonSelectOption, IonIcon, IonInput, IonItemDivider } from '@ionic/react';

import { useForm } from 'react-hook-form';
import { cloudUploadOutline } from 'ionicons/icons';

/* Custom components */
import Router from 'next/router';
import { useEffect } from 'react';
import AppPage from '../../../components/AppPage';
import IonController, { IonFileButtonController } from '../../../components/IonController';
import IonCenterContent from '../../../components/IonCenterContent';

/* insert database function */
import { addHomework } from '../../../services/homeworks';
import { toBase64 } from '../../../utils/fileUtils';
import SubmitButton from '../../../components/SubmitButton';
import { useMyEditableCourses } from '../../../services/courses';

import { useOnErrorAlert, makeAPIErrorAlert, onSubmitError } from '../../../utils/errors';
import { makeToast, makeAlert } from '../../../components/GlobalNotifications';
import CoolDateTimeRangePicker from '../../../components/CoolDateTimeRangePicker';
import Expandable from '../../../components/Expandable';
import { arrayFromRange } from '../../../utils';

const AddHomework = () => {
  const { control, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues: {
      maxReachablePoints: 120,
      correctionVariant: 'correct-one',
      evaluationVariant: 'efforts',
      correctionValidation: 'lecturers',
      samplesize: '0',
      threshold: '-1',
      solutionAllowedFormats: ['textfield'],
      correctionAllowedFormats: ['textfield'],
    },
  });
  const { data: courses } = useOnErrorAlert(useMyEditableCourses());

  const onSubmit = async (data) => {
    try {
      const [doingStart, doingEnd] = data.doingRange;
      const [correctingStart, correctingEnd] = data.correctingRange;

      if (doingStart > doingEnd || correctingStart > correctingEnd || correctingStart < doingEnd) {
        return makeAlert({
          header: 'Date input incorrect!',
          subHeader: 'Please make sure that the start date of the processing period is before the end date.',
        });
      }

      const base64Exercise = await toBase64(data.exerciseAssignment[0]);
      const base64Solution = data.modelSolution ? await toBase64(data.modelSolution[0]) : null;
      const base64Evaluation = data.evaluationScheme ? await toBase64(data.evaluationScheme[0]) : null;
      const solutionName = data.modelSolution ? data.modelSolution[0].name : null;
      const evaluationName = data.evaluationScheme ? data.evaluationScheme[0].name : null;

      await addHomework(
        data.homeworkName,
        data.courses,
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
      );

      Router.push('/manage/homeworks');

      return makeToast({
        header: 'Homework successfully added!',
        subHeader: 'Go to course page now',
      });
    } catch (ex) {
      return makeAPIErrorAlert(ex);
    }
  };

  const [, minCorrecting] = watch('doingRange') || [];
  useEffect(() => {
    setValue('correctingRange', [minCorrecting, (getValues('correctingRange') ?? [])[1]]);
  }, [getValues, minCorrecting, setValue]);

  const correctionVariantIsB = watch('correctionVariant') === 'correct-two';

  return (
    <AppPage title="Homework Upload">
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
                  <IonInput class="ion-text-right" type="text" cancelText="Dismiss" placeholder="e.g. Programming Assignment 1" maxlength="64" />
                )}
              />
            </IonItem>

            <IonItem>
              <IonLabel>
                Course Selection
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
                      <IonSelectOption value="points">Number of points</IonSelectOption>
                      <IonSelectOption value="zeroToOnehundred">0% - 100%</IonSelectOption>
                      <IonSelectOption value="notWrongRight">not-wrong-correct-made</IonSelectOption>
                      <IonSelectOption value="itsOkayToFail">not-wrong-correct-made - It&apos;s Okay to fail</IonSelectOption>
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
                  Each submitted homework is assigned to a corrector, you determine how many (1, 2, 3...) of the corrected homework is randomly assigned to them for review (sample).
                  {
                    correctionVariantIsB && 'Variant B: In addition to the sample, a task is always assigned to 2 correctors. If the deviation between the corrected homework exceeds a certain threshold (5% - 30%) set by the lecturer, the tutor receives the corrected homework for review.'
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
                  <CoolDateTimeRangePicker disabled={!minCorrecting} minimum={minCorrecting} />
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
                Sample Solution
              </IonLabel>
              <IonFileButtonController control={control} name="modelSolution">Upload</IonFileButtonController>
            </IonItem>
            <IonItem>
              <IonLabel>
                Evaluation Scheme
              </IonLabel>
              <IonFileButtonController control={control} name="evaluationScheme">Upload</IonFileButtonController>
            </IonItem>

          </IonList>

          <div className="ion-padding">
            <SubmitButton expand="block" class="ion-no-margin">
              <IonIcon icon={cloudUploadOutline} />
              <IonText>
                &nbsp;Upload Homework
              </IonText>

            </SubmitButton>
          </div>
        </form>
      </IonCenterContent>
    </AppPage>
  );
};

export default AddHomework;
