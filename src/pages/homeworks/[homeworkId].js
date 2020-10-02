/*
As described in Prax-161
https://confluence.praxisprojekt.cf/display/FACH/PRAX-161%3A+View+Homework+Page
Author: Yannick Lehr
Backend-functions can be found in: ...
*/
/* Ionic imports */
import { IonButton, IonItem, IonLabel, IonList, IonSearchbar } from '@ionic/react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { bookmarkOutline, downloadOutline, checkboxOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import AppPage from '../../components/AppPage';

import Expandable from '../../components/Expandable';

import { useOnErrorAlert } from '../../utils/errors';
import { useHomework } from '../../services/homeworks';

const ViewHomeworkPage = () => {
  // initialize router
  const router = useRouter();
  const { homeworkId } = router.query;

  // initialize state variables
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [submittedSolutions, setSubmittedSolutions] = useState([]);
  // const [homeworkFile, setHomeworkFile] = useState();

  const [searchTermUsers, setSearchTermUsers] = useState('');

  // get homework data from the api
  const { data: homeworkData } = useOnErrorAlert(useHomework(homeworkId));
  useEffect(() => {
    if (typeof homeworkData !== 'undefined') {
      setTitle(homeworkData.title);
      setStartDate(homeworkData.startDate);
      setEndDate(homeworkData.endDate);
      setSubmittedSolutions(homeworkData.submittedSolutions);
      // setHomeworkFile(homeworkData.homeworkFile);
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

  const userItems = submittedSolutions.filter((u) => u.firstname.concat(u.student).toLowerCase().includes(searchTermUsers.toLowerCase())).map((u) => {
    // return element list with user items
    return (
      <div style={{ width: '100%' }}>
        <IonItem key={u.userId}>
          <IonLabel position="float">{`${u.studentFName} ${u.studentLName} ${u.assignment} ${u.status} ${u.score} ${u.maxscore}`}</IonLabel>
          <IonLabel position="float">{` ${u.correctorFName} ${u.correctorLName}`}</IonLabel>
          <IonLabel position="float">{`${u.assignment}`}</IonLabel>
          <IonLabel position="float">{`${u.status}`}</IonLabel>
          <IonLabel position="float">{`${u.score}`}</IonLabel>
          <IonLabel position="float">{`${u.maxscore}`}</IonLabel>
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
        {checkboxOutline}
        <IonLabel>
          <h2>Download Task</h2>
        </IonLabel>
        <IonButton>Download</IonButton>
      </IonItem>
      <Expandable
        header="Submitted Solutions"
        ionIcon={downloadOutline}
      >
        <IonSearchbar placeholder="Search for solution" value={searchTermUsers} onIonChange={handleChangeSearch} />
        <IonList>
          {userItems}
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
