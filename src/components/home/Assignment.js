import { IonRow, IonCol } from '@ionic/react';

import Link from 'next/link';

const Assignment = ({ type, course, deadline }) => {
  return (
    <div>
      <IonRow>
        <IonCol size-lg={3}>
          <div className="ion-text-center" style={{ color: '#373A3C' }}>
            {type}
          </div>
        </IonCol>
        <IonCol size-lg={3}>
          <div className="ion-text-center" style={{ color: '#373A3C' }}>
            {course}
          </div>
        </IonCol>
        <IonCol size-lg={3}>
          <div className="ion-text-center" style={{ color: '#373A3C' }}>
            {deadline}
          </div>
        </IonCol>
        <IonCol size-lg={3}>
          <div className="ion-text-center">
            <Link href="/"><a style={{ color: '#72993E' }}>öffnen</a></Link>
          </div>
        </IonCol>
      </IonRow>
    </div>
  );
};
<<<<<<< HEAD
=======

>>>>>>> master
export default Assignment;
