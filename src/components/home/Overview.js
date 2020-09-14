import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow } from '@ionic/react';

<<<<<<< HEAD

export default ({ title, content, width, widthMobile }) => {
=======
const Overview = ({ title, content, width, widthMobile }) => {
>>>>>>> master
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle style={{ color: '#72993E' }}><h3>{title}</h3></IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            {content.map((value) => {
              return <IonCol size-xl={width} size={widthMobile}>{value}</IonCol>;
            })}
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};
<<<<<<< HEAD
=======

export default Overview;
>>>>>>> master
