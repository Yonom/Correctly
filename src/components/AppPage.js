import { IonTitle, IonFooter, IonToolbar, IonPage, IonHeader, IonContent } from '@ionic/react';

const AppPage = ({ children, title, footer }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {children}
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonTitle>{footer}</IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default AppPage;
