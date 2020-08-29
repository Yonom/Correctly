import React from 'react';
import { IonApp, IonMenu, IonHeader, IonToolbar, IonImg, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonText, IonFooter, IonPage, IonTitle, IonButtons, IonButton } from '@ionic/react';
import Router from 'next/router';
import useSWR from 'swr';
import styles from './Layout_alt.module.css';

export default () => {
  const { data, error } = useSWR('/api/auth/me');
  if (error) return 'failed to load';
  if (!data) return 'loading...';

  const name = `${data.firstname} ${data.lastname}`;
  const { role } = data;

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
        <IonContent color={clg} style={{ display: 'flex' }}>
          <IonImg className={styles.menu} src={logoPath} />
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
          <div style={{ flexGrow: 1 }} />
          <IonLabel>
            {version}
          </IonLabel>
        </IonContent>
      </IonMenu>

      <IonPage className="ion-page" id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuToggle>
                <IonButton>
                  <IonIcon slot="icon-only" name="menu" src={iconBurger} />
                </IonButton>
              </IonMenuToggle>
            </IonButtons>
            <IonTitle>
              <IonImg className={styles.menu} src={logoPath} />
            </IonTitle>

            <IonText slot="end">
              {name}
              <br />
              {role}
            </IonText>
            <IonImg slot="end" src={iconProfile} className={styles.profilePicture} />
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <h1>Main Content</h1>
          <p>Click the icon in the top left to toggle the menu.</p>
        </IonContent>
      </IonPage>
    </IonApp>
  );
};
