import { IonCard, IonCardHeader, IonCardTitle, IonItemDivider, IonCardContent } from '@ionic/react';

export default () => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle> Offene Hausaufgaben</IonCardTitle>
      </IonCardHeader>
      <IonItemDivider />
      <IonCardContent>
        <ion-grid>
          <ion-row>
            <ion-col>
              Case Study
            </ion-col>
            <ion-col>
              Coporate Finance 1721
            </ion-col>
            <ion-col>
              21.05.2020
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              Case Study
            </ion-col>
            <ion-col>
              Data Science 1721
            </ion-col>
            <ion-col>
              21.05.2020
            </ion-col>
          </ion-row>
        </ion-grid>
      </IonCardContent>
    </IonCard>

  );
};
