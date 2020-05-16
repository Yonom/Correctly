import { IonTitle, IonSplitPane, IonMenu, IonPage, IonHeader, IonToolbar, IonLabel, IonContent, IonButton, IonList, IonItem, IonIcon, IonImg, IonText } from '@ionic/react';
import React from 'react';

export default () => {
  const name = 'Benutzername';
  const role = 'Rolle';
  const logoPath = 'pics/picture.jpg';
  const iconPath = 'icons/Icon_Home.svg';

  return (
    <IonSplitPane contentId="main">
      {/* --  our side menu  --*/}
      <IonMenu contentId="main">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Placeholder for image</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem>
              <IonIcon src={iconPath} />
            </IonItem>
            <IonItem>
              <IonIcon src={iconPath} />
              <IonLabel position="fixed">Labeltext 1</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon src={iconPath} />
              <IonLabel position="fixed">Labeltext 2</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon src={iconPath} />
              <IonLabel position="fixed">Labeltext 3</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon src={iconPath} />
              <IonLabel position="fixed">Labeltext 4</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      {/* -- the main content --*/}
      <IonPage id="main">
        <IonHeader>
          <IonToolbar>
            <IonItem>
              <div>
                <IonLabel>{name}</IonLabel>
                <IonLabel position="stacked">{role}</IonLabel>
              </div>
              <IonLabel name="Add" />
            </IonItem>
          </IonToolbar>
        </IonHeader>
        <img src={logoPath} />
      </IonPage>
    </IonSplitPane>
  );
};
