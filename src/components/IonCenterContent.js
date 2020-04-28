import {
  IonGrid, IonRow, IonCol,
} from '@ionic/react';

export default ({ children, contentPadding }) => {
  return (
    <IonGrid style={{ height: '100%' }}>
      <IonRow style={{ height: '100%' }}>
        <IonCol class="ion-align-self-center" style={{ padding: contentPadding }}>
          { children }
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
