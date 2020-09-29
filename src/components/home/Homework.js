import { IonRow, IonCol } from '@ionic/react';

import Link from 'next/link';

const Homework = ({ name, course, deadline, id }) => {
  return (
    <div>
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
          <div className="ion-text-center" color="dark">
            {deadline}
          </div>
        </IonCol>
        <IonCol size-lg={3}>
          <div className="ion-text-center">
            <Link href="/{{id}}">open</Link>
          </div>
        </IonCol>
      </IonRow>
    </div>
  );
};
export default Homework;
