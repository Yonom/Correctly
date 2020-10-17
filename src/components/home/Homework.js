import { IonRow, IonCol, IonLabel, IonGrid } from '@ionic/react';
import moment from 'moment';

import Link from 'next/link';
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
      throw new Error('Unknown type.');
  }
};

const Homework = ({ type, name, course, deadline, studentId, id, userid }) => {
  const link = getLink(type, id, userid);
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
                  {deadline ? 'Deadline: ' : 'Student Id: '}
                  {deadline ? date : studentId}
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
