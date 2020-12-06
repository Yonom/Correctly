/* Ionic imports */
import { IonLabel, IonList, IonText, IonSelect, IonSelectOption, IonIcon, IonInput } from '@ionic/react';

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
import { makeToast, makeAlert, withLoading } from '../../../components/GlobalNotifications';
import CoolDateTimeRangePicker from '../../../components/CoolDateTimeRangePicker';
import Expandable from '../../../components/Expandable';
import { arrayFromRange } from '../../../utils';
import { EFFORTS, ITS_OK_TO_FAIL, NOT_WRONG_RIGHT, ONE_REVIEWER, POINTS, TWO_REVIEWERS, ZERO_TO_ONE_HUNDRED, AUDIT_BY_LECTURERS, AUDIT_BY_MODULE_COORDINATOR, TEXTFIELD, THRESHOLD_NA } from '../../../utils/constants';
import SafariFixedIonItem from '../../../components/SafariFixedIonItem';
import { fileFormats } from '../../../utils/config';

const AddHomeworkPage = () => {
  const { control, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues: {
      maxReachablePoints: 120,
      reviewerCount: ONE_REVIEWER,
      evaluationVariant: EFFORTS,
      auditors: AUDIT_BY_LECTURERS,
      samplesize: '0',
      threshold: THRESHOLD_NA,
      solutionAllowedFormats: [TEXTFIELD],
      reviewAllowedFormats: [TEXTFIELD],
    },
  });
  const { data: courses } = useOnErrorAlert(useMyEditableCourses());

  const onSubmit = withLoading(async (data) => {
    try {
      const [solutionStart, solutionEnd] = data.solutionRange;
      const [reviewStart, reviewEnd] = data.reviewRange;

      if (solutionStart > solutionEnd
        || reviewStart > reviewEnd
        || reviewStart < solutionEnd) {
        return makeAlert({
          header: 'Date input incorrect!',
          subHeader: 'Please make sure that the start date of the processing period is before the end date.',
        });
      }

      if (data.solutionAllowedFormats.length === 0
        || data.reviewAllowedFormats.length === 0) {
        return makeAlert({
          header: 'Not all mandatory field were filled out',
          subHeader: 'Please select which file formats should be allowed.',
        });
      }

      const base64Exercise = await toBase64(data.taskFiles[0]);
      const base64Solution = data.sampleSolutionFiles ? await toBase64(data.sampleSolutionFiles[0]) : null;
      const base64Evaluation = data.evaluationSchemeFiles ? await toBase64(data.evaluationSchemeFiles[0]) : null;
      const solutionName = data.sampleSolutionFiles ? data.sampleSolutionFiles[0].name : null;
      const evaluationName = data.evaluationSchemeFiles ? data.evaluationSchemeFiles[0].name : null;

      await addHomework(
        data.homeworkName,
        data.courses,
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
        data.taskFiles[0].name,
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
  });

  const [, minCorrecting] = watch('solutionRange') || [];
  useEffect(() => {
    setValue('reviewRange', [minCorrecting, (getValues('reviewRange') ?? [])[1]]);
  }, [getValues, minCorrecting, setValue]);

  const evaluationVariant = watch('evaluationVariant');

  const modifyThresholds = (evaluationVariant === EFFORTS || evaluationVariant === NOT_WRONG_RIGHT);
  useEffect(() => {
    setValue('threshold', THRESHOLD_NA);
  }, [getValues, modifyThresholds, setValue]);

  const reviewerCountIs1 = watch('reviewerCount') === ONE_REVIEWER;
  const reviewerCountIs2 = watch('reviewerCount') === TWO_REVIEWERS;

  return (
    <AppPage title="Add Homework">
      <IonCenterContent>
        <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
          <IonList lines="full" mode="md">
            <SafariFixedIonItem>
              <IonLabel>
                Homework Name
                <IonText color="danger"> *</IonText>
              </IonLabel>
              <IonController
                control={control}
                name="homeworkName"
                rules={{ required: true }}
                as={(
                  <IonInput class="ion-text-right" type="text" cancelText="Dismiss" placeholder="e.g. Programming Assignment 1" maxlength="64" />
                )}
              />
            </SafariFixedIonItem>

            <SafariFixedIonItem>
              <IonLabel>
                Course Selection
                <IonText color="danger"> *</IonText>
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
            </SafariFixedIonItem>

            <SafariFixedIonItem>
              <IonText>Achievable Points</IonText>
              <IonText color="danger"> *</IonText>
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
                  <IonText color="danger"> *</IonText>
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
                  Select, if you want one or two reviewers per homework
                  <IonText color="danger"> *</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="reviewerCount"
                  rules={{ required: true }}
                  as={(
                    <IonSelect okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value={ONE_REVIEWER}>1</IonSelectOption>
                      <IonSelectOption value={TWO_REVIEWERS}>2</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </SafariFixedIonItem>
              <SafariFixedIonItem className="ion-padding">
                <i>
                  {
                    reviewerCountIs1 && 'One reviewer per submitted solution: Means that only a sample (you determine the size below) of all solutions with their review is selected for audit.'
                  }
                  {
                    reviewerCountIs2 && 'Two reviewers per submitted solution: Means that A sample (you determine the size below) of all solutions with their reviews is selected for audit. Additionally, if there is a deviation in grading between the two reviews that exceeds the selected threshold (5%-30%, in case of N/A no deviation is checked), the lecturer receives this solution plus its two reviews for a lecturer audit.'
                  }
                </i>
              </SafariFixedIonItem>

              <SafariFixedIonItem>
                <IonLabel>
                  Who is responsible for auditing?
                  <IonText color="danger"> *</IonText>
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
                  Sample Size
                  <IonText color="danger"> *</IonText>
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
                  <IonText color="danger"> *</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="threshold"
                  rules={{ required: true }}
                  as={!modifyThresholds ? (
                    <IonSelect okText="Okay" cancelText="Dismiss" disabled={!reviewerCountIs2}>
                      <IonSelectOption value={THRESHOLD_NA}>N/A</IonSelectOption>
                      {arrayFromRange(5, 100, 5).map((n) => (
                        <IonSelectOption key={n} value={n.toString()}>
                          {n}
                          %
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  ) : (
                    <IonSelect okText="Okay" cancelText="Dismiss" disabled={!reviewerCountIs2}>
                      <IonSelectOption value={THRESHOLD_NA}>Deactivate Audits caused by a difference in reviews</IonSelectOption>
                      <IonSelectOption value={50}>Activate Audits caused by a difference in reviews</IonSelectOption>
                    </IonSelect>
                  )}
                />
              </SafariFixedIonItem>

              <SafariFixedIonItem>
                <IonLabel>
                  Allowed file formats (submission)
                  <IonText color="danger"> *</IonText>
                </IonLabel>
                <IonController
                  control={control}
                  name="solutionAllowedFormats"
                  rules={{ required: true }}
                  as={(
                    <IonSelect multiple="true" okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value={TEXTFIELD}>Programming Code (Python)</IonSelectOption>
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
                  <IonText color="danger"> *</IonText>
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
                Solution Upload Timeframe:
                <IonText color="danger"> *</IonText>
              </IonLabel>
            </SafariFixedIonItem>
            <div>
              <IonController
                name="solutionRange"
                control={control}
                rules={{ required: true }}
                as={CoolDateTimeRangePicker}
              />
            </div>

            <SafariFixedIonItem lines="none">
              <IonLabel style={{ fontWeight: 'bold' }}>
                Review Timeframe:
                <IonText color="danger"> *</IonText>
              </IonLabel>
            </SafariFixedIonItem>
            <div>
              <IonController
                name="reviewRange"
                control={control}
                rules={{ required: true }}
                as={
                  <CoolDateTimeRangePicker disabled={!minCorrecting} minimum={minCorrecting} />
                }
              />
            </div>

            <SafariFixedIonItem>
              <IonLabel>
                Task
                <IonText color="danger"> *</IonText>
              </IonLabel>
              <IonFileButtonController rules={{ required: true }} control={control} name="taskFiles">Upload</IonFileButtonController>
            </SafariFixedIonItem>
            <SafariFixedIonItem>
              <IonLabel>
                Sample Solution
              </IonLabel>
              <IonFileButtonController control={control} name="sampleSolutionFiles">Upload</IonFileButtonController>
            </SafariFixedIonItem>
            <SafariFixedIonItem>
              <IonLabel>
                Evaluation Scheme
              </IonLabel>
              <IonFileButtonController control={control} name="evaluationSchemeFiles">Upload</IonFileButtonController>
            </SafariFixedIonItem>

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

export default AddHomeworkPage;
