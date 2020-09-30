import { IonRow, IonCol, IonLabel, IonItem, IonGrid, IonButton } from '@ionic/react';

import Link from 'next/link';

const Homework = ({ name, course, deadline, key }) => {
  const link = `/homeworks/${{ key }}/`;
  const deadlinearray = deadline.split('T');
  const datearray = deadlinearray[0].split('-');
  const date = `${datearray[2]}.${datearray[1]}.${datearray[0]}`;
  const deadlinearraytime = deadlinearray[1].split('.');
  const timearray = deadlinearraytime[0].split(':');
  const time = `${timearray[0]}:${timearray[1]}`;
  return (
    <div>
      <IonItem>
        <IonLabel>
          <IonGrid>
            <IonRow>
              <IonCol size-lg={3}>
                <div className="ion-text-start" color="dark">
                  {name}
                </div>
              </IonCol>
              <IonCol size-lg={3}>
                <div className="ion-text-center" color="dark">
                  {course}
                </div>
              </IonCol>
              <IonCol size-lg={3}>
                <div className="ion-text-start" color="dark">
                  {time}
                  {'    '}
                  {date}

                </div>
              </IonCol>
              <IonCol size-lg={3}>
                <div className="ion-text-end">
                  <Link href={link}>
                    open
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
