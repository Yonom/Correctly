import React from 'react';
import { IonApp, IonMenu, IonHeader, IonToolbar, IonImg, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonText, IonFooter, IonPage, IonTitle, IonButtons, IonButton } from '@ionic/react';
import Router from 'next/router';

export default () => {
  const name = 'Benutzername';
  const role = 'Rolle';

  const logoPath = '/img/pics/full.jpg';

  const iconBurger = '/img/icons/Icon_Burger.svg';
  const iconHelp = '/img/icons/Icon_Help.svg';
  const iconHome = '/img/icons/Icon_Home.svg';
  const iconLogout = '/img/icons/Icon_Logout.svg';
  const iconProfile = '/img/icons/Icon_profiledummy.svg';
  const iconSettings = '/img/icons/Icon_Settings.svg';

  const branch = process.env.VERCEL_GITHUB_COMMIT_REF || 'local';
  const commitId = process.env.VERCEL_GITHUB_COMMIT_SHA || 'dev';
  const version = `V. 1.0.0 | ${branch} | ${commitId.substring(0, 8)}`;

  const clg = 'correctly-light-grey';

  const homeHandler = () => {
    Router.push('/');
  };
  const hilfeHandler = () => {
    Router.push('/help');
  };
  const einstellungHandler = () => {
    Router.push('/settings');
  };
  const logoutHandler = () => {
    Router.push('/logout');
  };

  return (
    <IonApp>
      <IonMenu content-id="main-content">
        <IonHeader>
          <IonToolbar color={clg}>
            <IonImg src={logoPath} />
          </IonToolbar>
        </IonHeader>

        <IonContent color={clg}>
          <IonList>
            <IonMenuToggle auto-hide="false">
              <IonItem button color={clg} onClick={homeHandler}>
                <IonIcon slot="start" name="home" src={iconHome} />
                <IonLabel>
                  Home
                </IonLabel>
              </IonItem>
              <IonItem button color={clg} onClick={hilfeHandler}>
                <IonIcon slot="start" name="help" src={iconHelp} />
                <IonLabel>
                  Hilfe
                </IonLabel>
              </IonItem>
              <IonItem button color={clg} onClick={einstellungHandler}>
                <IonIcon slot="start" name="settings" src={iconSettings} />
                <IonLabel>
                  Einstellungen
                </IonLabel>
              </IonItem>
              <IonItem button color={clg} onClick={logoutHandler}>
                <IonIcon slot="start" name="logout" src={iconLogout} />
                <IonLabel>
                  Abmelden
                </IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
        <IonFooter>
          <IonLabel>
            {version}
          </IonLabel>
        </IonFooter>
      </IonMenu>

      <IonPage class="ion-page" id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuToggle>
                <IonButton>
                  <IonIcon slot="icon-only" name="menu" src={iconBurger} />
                </IonButton>
              </IonMenuToggle>
            </IonButtons>
            <IonTitle>Header</IonTitle>
            <IonText slot="end">{name}</IonText>
            <IonText slot="end">{role}</IonText>
            <IonImg slot="end" src={iconProfile} />
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-padding">
          <h1>Main Content</h1>
          <p>Click the icon in the top left to toggle the menu.</p>
        </IonContent>
      </IonPage>
    </IonApp>
  );
};
