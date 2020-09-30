import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow } from '@ionic/react';

const Overview = ({ title, content, size }) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle color="tertiary">{title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            {content.map((value, i) => {
              // eslint-disable-next-line react/no-array-index-key
              return <IonCol key={i} size={size}>{value}</IonCol>;
            })}
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};
export default Overview;
