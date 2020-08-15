import { IonGrid, IonRow, IonCol } from '@ionic/react';

const IonCenterContent = ({ children, innerStyle }) => {
  return (
    <IonGrid style={{ height: '100%' }}>
      <IonRow style={{ height: '100%' }}>
        <IonCol class="ion-align-self-center" style={innerStyle}>
          {children}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default IonCenterContent;
