import React from 'react';
import { IonSplitPane, IonApp, IonMenu, IonHeader, IonToolbar, IonImg, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonText, IonPage, IonButtons, IonButton } from '@ionic/react';
import Router from 'next/router';
import useSWR from 'swr';
import { menuOutline, helpCircleOutline, homeOutline, logOutOutline, settingsOutline, personCircleOutline } from 'ionicons/icons';
import styles from './Layout.module.css';

const Layout = () => {
  const { data, error } = useSWR('/api/auth/me');
  if (error) return 'failed to load';
  if (!data) return 'loading...';

  const name = `${data.firstname} ${data.lastname}`;
  const { role } = data;

  const logoPath = '/img/logo.jpg';

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
      <IonSplitPane content-id="main-content">
        <IonMenu content-id="main-content">
          <IonContent color={clg} style={{ display: 'flex' }}>
            <IonImg className={styles.menu} src={logoPath} />
            <IonList>
              <IonMenuToggle auto-hide="false">
                <IonItem button color={clg} onClick={homeHandler}>
                  <IonIcon slot="start" icon={homeOutline} />
                  <IonLabel>
                    Home
                  </IonLabel>
                </IonItem>
                <IonItem button color={clg} onClick={hilfeHandler}>
                  <IonIcon slot="start" icon={helpCircleOutline} />
                  <IonLabel>
                    Hilfe
                  </IonLabel>
                </IonItem>
                <IonItem button color={clg} onClick={einstellungHandler}>
                  <IonIcon slot="start" icon={settingsOutline} />
                  <IonLabel>
                    Einstellungen
                  </IonLabel>
                </IonItem>
                <IonItem button color={clg} onClick={logoutHandler}>
                  <IonIcon slot="start" icon={logOutOutline} />
                  <IonLabel>
                    Abmelden
                  </IonLabel>
                </IonItem>
              </IonMenuToggle>
            </IonList>
            <div style={{ flexGrow: 1 }} />
            <IonLabel style={{ textAlign: 'center' }}>
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
                    <IonIcon slot="icon-only" icon={menuOutline} />
                  </IonButton>
                </IonMenuToggle>
              </IonButtons>

              <IonText slot="end">
                {name}
                <br />
                {role}
              </IonText>
              <IonIcon slot="end" icon={personCircleOutline} className={styles.profilePicture} />
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <h1>Main Content</h1>
            <p>Click the icon in the top left to toggle the menu.</p>
          </IonContent>
        </IonPage>

      </IonSplitPane>
    </IonApp>
  );
};

export default Layout;
