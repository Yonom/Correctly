import { IonRow, IonCol, IonLabel, IonGrid, IonButton } from '@ionic/react';

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
  const deadlinearray = deadline?.split('T') || [];
  const datearray = deadlinearray[0]?.split('-') || [];
  const date = `${datearray[2] ?? ''}.${datearray[1] ?? ''}.${datearray[0] ?? ''}`;
  const deadlinearraytime = deadlinearray[1]?.split('.') || [];
  const timearray = deadlinearraytime[0]?.split(':') || [];
  const time = `${timearray[0] ?? ''}:${timearray[1] ?? ''}`;
  return (
    <div>
      <SafariFixedIonItem color="">
        <IonLabel>
          <IonGrid>
            <IonRow>
              <IonCol>
                <div className="ion-text-start" color="dark" size-sm={6}>
                  {name}
                </div>
              </IonCol>
              <IonCol>
                <div className="ion-text-start" color="dark" size-sm={6}>
                  {course}
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <div className="ion-text-start" color="dark" size-sm={12}>
                  {deadline ? time : studentId}
                </div>
              </IonCol>
              <IonCol>
                <div className="ion-text-start" color="dark" size-sm={12}>
                  {deadline && date}
                </div>
              </IonCol>
              <IonCol>
                <div className="ion-text-start" size-sm={12}>
                  <Link href={link}>
                    <IonButton expand="block" color="" fill="clear"> open </IonButton>
                  </Link>
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
