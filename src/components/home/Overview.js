import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow } from '@ionic/react';

const Overview = ({ title, content }) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle style={{ color: '#72993E' }}><h3>{title}</h3></IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            {content.map((value, i) => {
              // eslint-disable-next-line react/no-array-index-key
              return <IonCol key={i} size={12}>{value}</IonCol>;
            })}
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};
export default Overview;
