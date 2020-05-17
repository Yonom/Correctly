import { IonTitle, IonSplitPane, IonMenu, IonPage, IonHeader, IonToolbar, IonLabel, IonContent, IonList, IonItem, IonIcon, IonImg, IonFooter } from '@ionic/react';
import React from 'react';

import '../pages/_app';

export default () => {
  const name = 'Benutzername';
  const role = 'Rolle';
  const logoPath = 'pics/full.jpg';
  const iconBurger = 'src/pages/icons/Icon_Burger.svg';
  const iconHelp = 'icons/Icon_Help.svg';
  const iconHome = 'icons/Icon_Home.svg';
  const iconLogout = 'icons/Icon_Logout.svg';
  const iconProfile = 'icons/Icon_profiledummy.svg';
  const iconSettings = 'icons/Icon_Settings.svg';
  const version = 'Version 1.0.0';

  return (
    <IonSplitPane contentId="main">
      {/* --  our side menu  --*/}
      <IonMenu contentId="main">
        <IonHeader>
          <IonToolbar color="fs_light_grey">
            <IonTitle>Placeholder for image</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent color="fs_light_grey">
          <IonList color="fs_light_grey" background-color="fs_light_grey">
            <IonItem color="fs_light_grey">
              <IonIcon src={iconBurger} />
            </IonItem>
            <IonItem color="fs_light_grey">
              <IonIcon src={iconHome} />
              <IonLabel position="fixed">Home</IonLabel>
            </IonItem>
            <IonItem color="fs_light_grey">
              <IonIcon src={iconHelp} />
              <IonLabel position="fixed">Hilfe</IonLabel>
            </IonItem>
            <IonItem color="fs_light_grey">
              <IonIcon src={iconSettings} />
              <IonLabel position="fixed">Einstellungen</IonLabel>
            </IonItem>
            <IonItem color="fs_light_grey">
              <IonIcon src={iconLogout} />
              <IonLabel position="fixed">Abmelden</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
        <IonFooter>
          <IonToolbar color="fs_light_grey">
            <h3>{version}</h3>
          </IonToolbar>
        </IonFooter>
      </IonMenu>

      {/* -- the main content --*/}
      <IonPage id="main">
        <IonHeader>
          <IonToolbar color="fs_light_grey">
            <IonItem color="fs_light_grey">
              <div>
                <IonLabel>{name}</IonLabel>
                <IonLabel position="stacked">{role}</IonLabel>
              </div>
              <IonLabel src={iconProfile} />
            </IonItem>
          </IonToolbar>
        </IonHeader>
        <IonImg src={logoPath} />
      </IonPage>
    </IonSplitPane>
  );
};
