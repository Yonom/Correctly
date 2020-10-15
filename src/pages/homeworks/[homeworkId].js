/*
As described in Prax-161
https://confluence.praxisprojekt.cf/display/FACH/PRAX-161%3A+View+Homework+Page
Author: Yannick Lehr
Backend-functions can be found in: ...
*/
/* Ionic imports */
import { IonButton, IonItem, IonLabel, IonList, IonSearchbar, IonIcon, IonGrid, IonCol, IonRow } from '@ionic/react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { bookmarkOutline, downloadOutline, checkboxOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import AppPage from '../../components/AppPage';

import Expandable from '../../components/Expandable';

import { useOnErrorAlert } from '../../utils/errors';
import { useHomework } from '../../services/homeworks';
import { useMyData } from '../../services/auth';
import { isLecturer } from '../../utils/auth/role';

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

  const solutionItems = [...solutions, ...usersWithoutSolution]
    .filter((u) => u.firstname.concat(u.lastname).toLowerCase().includes(searchTermUsers.toLowerCase()))
    .map((s) => {
      // return element list with solution items
      return (
        <div style={{ width: '100%' }}>
          <IonItem key={s.userId}>
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
          </IonItem>
        </div>
      );
    });

  return (
    <AppPage title={`Homework: ${title}`}>
      <Expandable
        header="Homework information"
        ionIcon={bookmarkOutline}
      >
        <IonItem>
          <IonLabel position="float">
            Homework:
          </IonLabel>
          <IonLabel position="float">
            {title}
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel position="float">
            Start Date
          </IonLabel>
          <IonLabel position="float">
            {startDate}
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel position="float">
            End Date
          </IonLabel>
          <IonLabel position="float">
            {endDate}
          </IonLabel>
        </IonItem>
      </Expandable>
      <IonItem>
        <IonIcon class="ion-padding" icon={downloadOutline} color="dark" />
        <IonLabel><h2>Download Task</h2></IonLabel>
        <form method="get" action={`/api/homeworks/downloadExerciseAssignment?homeworkId=${homeworkId}`}>
          <IonButton type="submit">
            Download
            <input type="hidden" name="homeworkId" value={homeworkId ?? '-'} />
          </IonButton>
        </form>
      </IonItem>
      <Expandable
        header="Submitted Solutions"
        extra={isLecturer(role) && <IonButton>Show CSV</IonButton>}
        ionIcon={checkboxOutline}
      >
        <IonSearchbar placeholder="Search for solution" value={searchTermUsers} onIonChange={handleChangeSearch} />
        <IonList>
          <div style={{ width: '100%' }}>
            <IonItem>
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
            </IonItem>
            {solutionItems}
          </div>
        </IonList>
      </Expandable>
      <section className="ion-padding">
        <Link href="/" passHref>
          <IonButton color="medium" size="default" fill="clear" expand="block" class="ion-no-margin">Back to the menu</IonButton>
        </Link>
      </section>
    </AppPage>
  );
};

export default ViewHomeworkPage;
