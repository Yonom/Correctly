import { IonGrid, IonRow, IonCol } from '@ionic/react';

const IonCenterContent = ({ children }) => {
  return (
    <IonGrid style={{ height: '100%' }} fixed>
      <IonRow style={{ height: '100%' }}>
        <IonCol class="ion-align-self-center">
          {children}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default IonCenterContent;
