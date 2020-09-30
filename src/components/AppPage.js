import React from 'react';
import { IonTitle, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonImg, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonPage, IonButtons, IonButton, IonText } from '@ionic/react';
import Head from 'next/head';
import Router from 'next/router';
import { menuOutline, homeOutline, logOutOutline, peopleOutline, libraryOutline, clipboardOutline } from 'ionicons/icons';
import Link from 'next/link';
import styles from './AppPage.module.css';
import ProfileBadge from './ProfileBadge';
import { useMyData, logout } from '../services/auth';
import { isLecturer, isSuperuser } from '../utils/auth/role';
import { makeToast } from './GlobalNotifications';
import { makeAPIErrorAlert } from '../utils/errors';
import { useLgOrUp } from '../utils/mediaUtils';

const AppPage = ({ title, children }) => {
  const { data: user } = useMyData();
  const lgOrUp = useLgOrUp();
  const loggedIn = user?.loggedIn;
  const role = user?.role;

  const logoPath = '/img/correctly_wt.svg';

  const branch = process.env.VERCEL_GITHUB_COMMIT_REF || 'local';
  const commitId = process.env.VERCEL_GITHUB_COMMIT_SHA || 'dev';
  const version = `${branch} | ${commitId.substring(0, 8)}`;

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
  const logoutHandler = async () => {
    try {
      await logout();
    } catch (ex) {
      return makeAPIErrorAlert(ex);
    }

    Router.push('/auth/login');
    return makeToast({ message: 'You are now logged out.' });
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
            <IonImg className={styles.menuIcon} src={logoPath} />
            <IonList>
              <IonMenuToggle auto-hide="false">
                {!lgOrUp && loggedIn && (
                  <IonItem>
                    <ProfileBadge slot="" />
                  </IonItem>
                )}

                {loggedIn && (
                  <IonItem button onClick={homeHandler}>
                    <IonIcon slot="start" icon={homeOutline} />
                    <IonLabel>
                      Home
                    </IonLabel>
                  </IonItem>
                )}
                {isLecturer(role) && (
                  <IonItem button onClick={manageHomeworksHandler}>
                    <IonIcon slot="start" icon={clipboardOutline} />
                    <IonLabel>
                      Edit Homeworks
                    </IonLabel>
                  </IonItem>
                )}
                {isLecturer(role) && (
                  <IonItem button onClick={manageCoursesHandler}>
                    <IonIcon slot="start" icon={libraryOutline} />
                    <IonLabel>
                      Edit Courses
                    </IonLabel>
                  </IonItem>
                )}
                {isSuperuser(role) && (
                  <IonItem button onClick={manageUsersHandler}>
                    <IonIcon slot="start" icon={peopleOutline} />
                    <IonLabel>
                      Edit Users
                    </IonLabel>
                  </IonItem>
                )}
                {loggedIn && (
                  <IonItem button onClick={logoutHandler}>
                    <IonIcon slot="start" icon={logOutOutline} />
                    <IonLabel>
                      Log Out
                    </IonLabel>
                  </IonItem>
                )}
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
