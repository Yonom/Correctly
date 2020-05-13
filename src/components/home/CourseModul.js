import { IonCard, IonCardHeader, IonCardContent } from '@ionic/react';

export default (props) => {
  const { name } = props;
  const { id } = props;
  return (
    <IonCard>
      <IonCardHeader />
      <IonCardContent>
        <ion-grid>
          <ion-row>
            <ion-col>
              {name}
            </ion-col>
            <ion-col>
              {id}
            </ion-col>
          </ion-row>
        </ion-grid>
      </IonCardContent>
    </IonCard>
  );
};
