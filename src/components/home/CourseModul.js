import { IonCard, IonCardHeader, IonCardContent } from '@ionic/react';

export default (props) => {
  const { name } = props;
  const { id } = props;
  return (
    <IonCard style={{ background: '#F4F4F4' }}>
      <IonCardHeader />
      <IonCardContent>
        <ion-grid>
          <ion-row>
            <div className="ion-text-center" style={{ color: '#373A3C' }}>{name}</div>
          </ion-row>
          <ion-row>
            <div style={{ color: '#373A3C' }}>{id}</div>
          </ion-row>
        </ion-grid>
      </IonCardContent>
    </IonCard>
  );
};
