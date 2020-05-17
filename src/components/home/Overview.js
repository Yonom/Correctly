import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';


export default (props) => {
  const { title } = props;
  const { content } = props;


  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle style={{ color: '#72993E' }}><h3>{title}</h3></IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <ion-grid>
          <ion-row>
            {content.map((value, index) => {
              /* map items and start new row after 3 */
              return <ion-col>{value}</ion-col>;
            })}
          </ion-row>
        </ion-grid>
      </IonCardContent>
    </IonCard>
  );
};
