import { IonTitle, IonFooter, IonToolbar, IonPage, IonHeader } from '@ionic/react';

const AppPage = ({ children, title, footer }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      {children}
      <IonFooter>
        <IonToolbar>
          <IonTitle>{footer}</IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default AppPage;
