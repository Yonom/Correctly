import { IonCard, IonCardContent } from '@ionic/react';

export default (props) => {
  const { course } = props;

  return (
    <IonCard style={{ background: '#F4F4F4' }}>
      <IonCardContent>
        <ion-grid>
          <ion-row>
            <ion-col size={12}>
              <div className="ion-text-center" style={{ color: '#373A3C' }}><b>{course.name}</b></div>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size={12}>
              <div className="ion-text-center" style={{ color: '#373A3C' }}>{course.id}</div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </IonCardContent>
    </IonCard>
  );
};
