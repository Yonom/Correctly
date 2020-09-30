import { IonRow, IonCol, IonLabel, IonItem, IonGrid, IonButton } from '@ionic/react';

import Link from 'next/link';

const Homework = ({ name, course, deadline, studentId, id }) => {
  const link = `/homeworks/${{ id }}/`;
  const deadlinearray = deadline?.split('T') || [];
  const datearray = deadlinearray[0]?.split('-') || [];
  const date = `${datearray[2] ?? ''}.${datearray[1] ?? ''}.${datearray[0] ?? ''}`;
  const deadlinearraytime = deadlinearray[1]?.split('.') || [];
  const timearray = deadlinearraytime[0]?.split(':') || [];
  const time = `${timearray[0] ?? ''}:${timearray[1] ?? ''}`;
  return (
    <div>
      <IonItem color="">
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
      </IonItem>
    </div>
  );
};
export default Homework;
