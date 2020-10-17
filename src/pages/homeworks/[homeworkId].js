/*
As described in Prax-161
https://confluence.praxisprojekt.cf/display/FACH/PRAX-161%3A+View+Homework+Page
Author: Yannick Lehr
Backend-functions can be found in: ...
*/
/* Ionic imports */
import { IonButton, IonLabel, IonList, IonSearchbar, IonIcon, IonGrid, IonCol, IonRow } from '@ionic/react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import moment from 'moment';
import { bookmarkOutline, downloadOutline, checkboxOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import AppPage from '../../components/AppPage';

import Expandable from '../../components/Expandable';

import { useOnErrorAlert } from '../../utils/errors';
import { useHomework } from '../../services/homeworks';
import { useMyData } from '../../services/auth';
import { isLecturer } from '../../utils/auth/role';
import SafariFixedIonItem from '../../components/SafariFixedIonItem';

const ViewHomeworkPage = () => {
  // initialize router
  const router = useRouter();
  const { homeworkId } = router.query;

  // initialize state variables
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { data: user } = useMyData();
  const role = user?.role;

  const [solutions, setSolutions] = useState([]);
  const [usersWithoutSolution, setUsersWithoutSolution] = useState([]);
  const [searchTermUsers, setSearchTermUsers] = useState('');

  // get homework data from the api
  const { data: homeworkData } = useOnErrorAlert(useHomework(homeworkId));
  useEffect(() => {
    if (typeof homeworkData !== 'undefined') {
      setTitle(homeworkData.homeworkName);
      setStartDate(homeworkData.doingStart);
      setEndDate(homeworkData.doingEnd);
      setSolutions(homeworkData.solutions);
      setUsersWithoutSolution(homeworkData.usersWithoutSolution);
    }
  }, [homeworkData]);

  /**
   * returns a readable role string for a given user
   *
   * @param {object} user the user for which a role string should be returned.
   *
   */

  const handleChangeSearch = (event) => {
    setSearchTermUsers(event.target.value);
  };

  const solutSafariFixedIonItems = [...solutions, ...usersWithoutSolution]
    .filter((u) => u.firstname.concat(u.lastname).toLowerCase().includes(searchTermUsers.toLowerCase()))
    .map((s) => {
      // return element list with solution items
      return (
        <div style={{ width: '100%' }}>
          <SafariFixedIonItem key={s.userId}>
            <IonLabel position="float">
              <Link href={`/users/${s.userid}`}>
                <a>
                  {`${s.firstname} ${s.lastname}`}
                </a>
              </Link>
            </IonLabel>
            <IonLabel position="float">{s.id ? 'Submitted' : 'Open'}</IonLabel>
            <IonLabel position="float">{s.percentagegrade}</IonLabel>
            {s.id && <IonButton position="float" href={`/homeworks/${homeworkId}/${s.userid}`}>SHOW</IonButton>}
          </SafariFixedIonItem>
        </div>
      );
    });

  return (
    <AppPage title={`Homework: ${title}`}>
      <Expandable
        header="Homework information"
        ionIcon={bookmarkOutline}
      >
        <SafariFixedIonItem>
          <IonLabel position="float">
            Homework:
          </IonLabel>
          <IonLabel position="float">
            {title}
          </IonLabel>
        </SafariFixedIonItem>
        <SafariFixedIonItem>
          <IonLabel position="float">
            Start Date
          </IonLabel>
          <IonLabel position="float">
            {moment(startDate).format('DD.MM.YYYY - HH:mm')}
          </IonLabel>
        </SafariFixedIonItem>
        <SafariFixedIonItem>
          <IonLabel position="float">
            End Date
          </IonLabel>
          <IonLabel position="float">
            {moment(endDate).format('DD.MM.YYYY - HH:mm')}
          </IonLabel>
        </SafariFixedIonItem>
      </Expandable>
      <SafariFixedIonItem>
        <IonIcon class="ion-padding" icon={downloadOutline} color="dark" />
        <IonLabel><h2>Download Task</h2></IonLabel>
        <form method="get" action={`/api/homeworks/downloadExerciseAssignment?homeworkId=${homeworkId}`}>
          <IonButton type="submit">
            Download
            <input type="hidden" name="homeworkId" value={homeworkId ?? '-'} />
          </IonButton>
        </form>
      </SafariFixedIonItem>
      <Expandable
        header="Submitted Solutions"
        extra={isLecturer(role) && <IonButton>CSV Export (not yet implemented)</IonButton>}
        ionIcon={checkboxOutline}
      >
        {isLecturer(role) && <IonSearchbar placeholder="Search for solution" value={searchTermUsers} onIonChange={handleChangeSearch} />}
        <IonList>
          <div style={{ width: '100%' }}>
            <SafariFixedIonItem>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonLabel position="float">Student</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel position="float">Status </IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel position="float">Score (%) </IonLabel>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </SafariFixedIonItem>
            {solutSafariFixedIonItems}
          </div>
        </IonList>
      </Expandable>
    </AppPage>
  );
};

export default ViewHomeworkPage;
