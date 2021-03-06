import React, { useState } from 'react';
import { IonTitle, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonImg, IonContent, IonList, IonMenuToggle, IonIcon, IonLabel, IonPage, IonButtons, IonButton } from '@ionic/react';
import Head from 'next/head';
import Router from 'next/router';
import { mailOutline, menuOutline, homeOutline, logOutOutline, peopleOutline, libraryOutline, clipboardOutline } from 'ionicons/icons';
import Link from 'next/link';
import styles from './AppPage.module.css';
import ProfileBadge from './ProfileBadge';
import { useMyData, logout } from '../services/auth';
import { isLecturer, isSuperuser } from '../utils/auth/role';
import { makeToast, withLoading } from './GlobalNotifications';
import { makeAPIErrorAlert } from '../utils/errors';
import { useLgOrUp } from '../utils/mediaUtils';
import SafariFixedIonItem from './SafariFixedIonItem';

const AppPage = ({ title, children }) => {
  const { data: user } = useMyData();
  const lgOrUp = useLgOrUp();
  const loggedIn = user?.loggedIn;
  const role = user?.role;
  const [counter, setCounter] = useState(0);
  const [logoPrefix, setLogoPrefix] = useState('');

  const logoPath = `/img/${logoPrefix}correctly_wt.svg`;

  const branch = process.env.VERCEL_GITHUB_COMMIT_REF || 'local';
  const commitId = process.env.VERCEL_GITHUB_COMMIT_SHA || 'dev';
  const version = `${branch} | ${commitId.substring(0, 8)}`;

  const logoHandler = () => {
    Router.push(loggedIn ? '/home' : '/auth/login');
    setCounter((c) => c + 1);
    if (counter > 5) {
      setLogoPrefix((c) => (c ? '' : 'in'));
    }
  };
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
  const logoutHandler = withLoading(async () => {
    try {
      await logout();
    } catch (ex) {
      return makeAPIErrorAlert(ex);
    }

    Router.push('/auth/login');
    return makeToast({ message: 'You are now logged out.' });
  });

  const supportHandler = () => {
    window.location.href = 'mailto:support@correctly.frankfurt.school';
  };

  return (
    <IonPage>
      <Head>
        <title>
          {title}
          {' '}
          - Correctly
        </title>
      </Head>
      <IonSplitPane content-id="main-content" className={styles.splitPane}>
        <IonMenu content-id="main-content">
          <IonContent>
            <button type="button" onClick={logoHandler} className={styles.menuIcon}>
              <IonImg src={logoPath} />
            </button>
            <IonList>
              <IonMenuToggle auto-hide="false">
                {!lgOrUp && loggedIn && (
                  <SafariFixedIonItem>
                    <ProfileBadge slot="" />
                  </SafariFixedIonItem>
                )}

                {loggedIn && (
                  <SafariFixedIonItem button onClick={homeHandler}>
                    <IonIcon slot="start" icon={homeOutline} />
                    <IonLabel>
                      Home
                    </IonLabel>
                  </SafariFixedIonItem>
                )}
                {isLecturer(role) && (
                  <SafariFixedIonItem button onClick={manageHomeworksHandler}>
                    <IonIcon slot="start" icon={clipboardOutline} />
                    <IonLabel>
                      Manage Homework
                    </IonLabel>
                  </SafariFixedIonItem>
                )}
                {isLecturer(role) && (
                  <SafariFixedIonItem button onClick={manageCoursesHandler}>
                    <IonIcon slot="start" icon={libraryOutline} />
                    <IonLabel>
                      Manage Courses
                    </IonLabel>
                  </SafariFixedIonItem>
                )}
                {isSuperuser(role) && (
                  <SafariFixedIonItem button onClick={manageUsersHandler}>
                    <IonIcon slot="start" icon={peopleOutline} />
                    <IonLabel>
                      Manage Users
                    </IonLabel>
                  </SafariFixedIonItem>
                )}
                {loggedIn && (
                  <SafariFixedIonItem button onClick={logoutHandler}>
                    <IonIcon slot="start" icon={logOutOutline} />
                    <IonLabel>
                      Log Out
                    </IonLabel>
                  </SafariFixedIonItem>
                )}
                <SafariFixedIonItem button onClick={supportHandler}>
                  <IonIcon slot="start" icon={mailOutline} />
                  <IonLabel>
                    Contact Support
                  </IonLabel>
                </SafariFixedIonItem>
              </IonMenuToggle>
            </IonList>
          </IonContent>
          <div className="ion-text-center">
            {version}
          </div>
          <div className="ion-text-center ion-padding">
            <Link href="/legal/privacy"><a>Privacy</a></Link>
            {' '}
            -
            {' '}
            <Link href="/legal/impressum"><a>Impressum</a></Link>
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
              {lgOrUp && (
                <>
                  <ProfileBadge />
                  <div slot="end" style={{ width: '20px' }} />
                </>
              )}
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
