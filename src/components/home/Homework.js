/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { IonRow, IonCol, IonLabel, IonGrid } from '@ionic/react';
import moment from 'moment';
import Router from 'next/router';
import { addLecturerReview } from '../../services/reviews';
import { AUDIT_REASON_PLAGIARISM, getReasonText } from '../../utils/constants';
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
