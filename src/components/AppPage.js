import React from 'react';
import { IonTitle, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonImg, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonPage, IonButtons, IonButton } from '@ionic/react';
import Router from 'next/router';
import { menuOutline, helpCircleOutline, homeOutline, logOutOutline, settingsOutline, peopleOutline, libraryOutline, clipboardOutline } from 'ionicons/icons';
import styles from './AppPage.module.css';
import ProfileBadge from './ProfileBadge';
import { useMyData } from '../services/auth';
import { isEmployee, isSuperuser } from '../utils/auth/role';

const AppPage = ({ title, children }) => {
  const { data: user } = useMyData();
  const role = user?.role;

  const logoPath = '/img/correctly_wt.svg';

  const branch = process.env.VERCEL_GITHUB_COMMIT_REF || 'local';
  const commitId = process.env.VERCEL_GITHUB_COMMIT_SHA || 'dev';
  const version = `V. 1.0.0 | ${branch} | ${commitId.substring(0, 8)}`;

  const homeHandler = () => {
    Router.push('/');
  };
  const manageHomeworksHandler = () => {
    Router.push('/manage/homeworks');
  };
  const manageCoursesHandler = () => {
    Router.push('/manage/courses');
  };
  const manageUsersHandler = () => {
    Router.push('/manage/users');
  };
  const hilfeHandler = () => {
    Router.push('/help');
  };
  const einstellungHandler = () => {
    Router.push('/settings');
  };
  const logoutHandler = () => {
    Router.push('/auth/logout');
  };

  return (
    <IonPage>
      <IonSplitPane content-id="main-content" className={styles.splitPane}>
        <IonMenu content-id="main-content">
          <IonContent>
            <IonImg className={styles.menuIcon} src={logoPath} />
            <IonList>
              <IonMenuToggle auto-hide="false">
                <IonItem button onClick={homeHandler}>
                  <IonIcon slot="start" icon={homeOutline} />
                  <IonLabel>
                    Home
                  </IonLabel>
                </IonItem>
                {isEmployee(role) && (
                  <IonItem button onClick={manageHomeworksHandler}>
                    <IonIcon slot="start" icon={clipboardOutline} />
                    <IonLabel>
                      Hausaufgaben
                      <br />
                      bearbeiten
                    </IonLabel>
                  </IonItem>
                )}
                {isEmployee(role) && (
                  <IonItem button onClick={manageCoursesHandler}>
                    <IonIcon slot="start" icon={libraryOutline} />
                    <IonLabel>
                      Kurse
                      <br />
                      bearbeiten
                    </IonLabel>
                  </IonItem>
                )}
                {isSuperuser(role) && (
                  <IonItem button onClick={manageUsersHandler}>
                    <IonIcon slot="start" icon={peopleOutline} />
                    <IonLabel>
                      Nutzer
                      <br />
                      bearbeiten
                    </IonLabel>
                  </IonItem>
                )}
                <IonItem button onClick={hilfeHandler}>
                  <IonIcon slot="start" icon={helpCircleOutline} />
                  <IonLabel>
                    Hilfe
                  </IonLabel>
                </IonItem>
                <IonItem button onClick={einstellungHandler}>
                  <IonIcon slot="start" icon={settingsOutline} />
                  <IonLabel>
                    Einstellungen
                  </IonLabel>
                </IonItem>
                {user && (
                  <IonItem button onClick={logoutHandler}>
                    <IonIcon slot="start" icon={logOutOutline} />
                    <IonLabel>
                      Abmelden
                    </IonLabel>
                  </IonItem>
                )}
              </IonMenuToggle>
            </IonList>
          </IonContent>
          <div className="ion-text-center">
            {version}
          </div>
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

              <IonTitle>{title}</IonTitle>
              <ProfileBadge />
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {children}
          </IonContent>
        </IonPage>
      </IonSplitPane>
    </IonPage>
  );
};

export default AppPage;
