/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { IonRow, IonCol, IonLabel, IonGrid } from '@ionic/react';
import moment from 'moment';
import Router from 'next/router';
import { addLecturerReview } from '../../services/reviews';
import { AUDIT_REASON_DID_NOT_SUBMIT_REVIEW, AUDIT_REASON_MISSING_REVIEW_SUBMISSION, AUDIT_REASON_PARTIALLY_MISSING_REVIEW_SUBMISSION, AUDIT_REASON_PLAGIARISM, AUDIT_REASON_SAMPLESIZE, AUDIT_REASON_THRESHOLD } from '../../utils/constants';
import { withLoading } from '../GlobalNotifications';
import SafariFixedIonItem from '../SafariFixedIonItem';

const getLink = (type, id, userId, solutionId, name) => {
  const handleRedirect = withLoading(async () => {
    const { id: reviewId } = await addLecturerReview(solutionId);
    await Router.push(`/reviews/${reviewId}/submission`);
  });

  switch (type) {
    case 'open-homework':
      return <a href={`/homeworks/${id}/submission`}>{name}</a>;
    case 'open-review': {
      if (userId) {
        return <a onClick={handleRedirect}>{name}</a>;
      }

      return <a href={`/reviews/${id}/submission`}>{name}</a>;
    }
    case 'open-audit':
      return <a href={`/homeworks/${id}/${userId}`}>{name}</a>;

    default:
      throw new Error('Unknown homework type.');
  }
};

const getReasonText = (reason) => {
  switch (reason) {
    case AUDIT_REASON_PARTIALLY_MISSING_REVIEW_SUBMISSION:
      return 'Solution is missing a review';
    case AUDIT_REASON_MISSING_REVIEW_SUBMISSION:
      return 'Solution did not receive any reviews';
    case AUDIT_REASON_DID_NOT_SUBMIT_REVIEW:
      return 'Student did not submit a review';
    case AUDIT_REASON_PLAGIARISM:
      return 'Plagiarism';
    case AUDIT_REASON_SAMPLESIZE:
      return 'Sample size';
    case AUDIT_REASON_THRESHOLD:
      return 'Threshold';
    default:
      throw new Error('Unknown reason type.');
  }
};

const Homework = ({ type, name, course, deadline, reason, id, userId, solutionId, plagiarismid }) => {
  const date = moment(deadline).format('DD.MM.YYYY - HH:mm');

  const link = getLink(type, id, userId, solutionId, name);

  return (
    <div>
      <SafariFixedIonItem color="">
        <IonLabel>
          <IonGrid>
            <IonRow>
              <IonCol>
                <div className="ion-text-start" color="dark" size-sm={6} style={{ fontWeight: 500 }}>
                  {link}
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <div className="ion-text-start" color="dark" size-sm={6}>
                  {course}
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <div className="ion-text-start" color="dark" size-sm={12}>
                  {deadline ? 'Deadline: ' : 'Reason: '}
                  {deadline ? date : getReasonText(reason)}
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <div className="ion-text-start" color="dark" size-sm={6}>
                  {reason === AUDIT_REASON_PLAGIARISM ? `Plagiarism ID: ${plagiarismid}` : ''}
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonLabel>
      </SafariFixedIonItem>
    </div>
  );
};
export default Homework;
