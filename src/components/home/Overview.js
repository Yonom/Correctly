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
            {content.map((value, index) => {
              if (index % 4 === 0) {
                return <ion-col>{value}</ion-col>;
              }

              return <ion-col>{value}</ion-col>;
            })}
          </ion-row>
        </ion-grid>
      </IonCardContent>
    </IonCard>
  );
};
