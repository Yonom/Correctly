import { IonRow, IonCol, IonLabel, IonGrid } from '@ionic/react';
import moment from 'moment';

import Link from 'next/link';
import { AUDIT_REASON_DID_NOT_SUBMIT_REVIEW, AUDIT_REASON_MISSING_REVIEW_SUBMISSION, AUDIT_REASON_PLAGIARISM, AUDIT_REASON_SAMPLESIZE, AUDIT_REASON_THRESHOLD } from '../../utils/constants';
import SafariFixedIonItem from '../SafariFixedIonItem';

const getLink = (type, id, userid) => {
  switch (type) {
    case 'open-homework':
      return `/homeworks/${id}/submission`;
    case 'open-review':
      return `/reviews/${id}/submission`;
    case 'open-audit':
      return `/homeworks/${id}/${userid}`;

    default:
      throw new Error('Unknown homework type.');
  }
};

const getReasonText = (reason) => {
  switch (reason) {
    case AUDIT_REASON_MISSING_REVIEW_SUBMISSION:
      return 'Solution is missing a review';
    case AUDIT_REASON_DID_NOT_SUBMIT_REVIEW:
      return 'Student did not submit a review';
    case AUDIT_REASON_PLAGIARISM:
      return 'Plagiarism';
    case AUDIT_REASON_SAMPLESIZE:
      return 'Sample Size';
    case AUDIT_REASON_THRESHOLD:
      return 'Threshold';
    default:
      throw new Error('Unknown reason type.');
  }
};

const Homework = ({ type, name, course, deadline, reason, id, userId }) => {
  const link = getLink(type, id, userId);
  const date = moment(deadline).format('DD.MM.YYYY - HH:mm');
  return (
    <div>
      <SafariFixedIonItem color="">
        <IonLabel>
          <IonGrid>
            <IonRow>
              <IonCol>
                <div className="ion-text-start" color="dark" size-sm={6} style={{ fontWeight: 500 }}>
                  <Link href={link}>
                    <a>{name}</a>
                  </Link>
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
          </IonGrid>
        </IonLabel>
      </SafariFixedIonItem>
    </div>
  );
};
export default Homework;
