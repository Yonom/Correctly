import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';


export default (props) => {
  const { title } = props;
  const { content } = props;

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <ion-grid>
          <ion-row>
            <ion-col>{content[0]}</ion-col>
            <ion-col>{content[1]}</ion-col>
          </ion-row>
        </ion-grid>
      </IonCardContent>
    </IonCard>
  );
};
