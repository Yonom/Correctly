/*
As described in Prax-161
https://confluence.praxisprojekt.cf/display/FACH/PRAX-161%3A+View+Homework+Page
Author: Yannick Lehr
Backend-functions can be found in: ...
*/
/* Ionic imports */
import { IonButton, IonLabel, IonList, IonSearchbar, IonIcon, IonGrid, IonCol, IonRow, IonLoading } from '@ionic/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import moment from 'moment';
import { bookmarkOutline, downloadOutline, checkboxOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import AppPage from '../../components/AppPage';
import { makeToast } from '../../components/GlobalNotifications';
import Expandable from '../../components/Expandable';
import { makeAPIErrorAlert, useOnErrorAlert } from '../../utils/errors';
import { useHomework, homeworksPublishGrades } from '../../services/homeworks';
import { useMyData } from '../../services/auth';
import { isLecturer, isStudent } from '../../utils/auth/role';
import SafariFixedIonItem from '../../components/SafariFixedIonItem';

const getStatus = (s, endDate) => {
  if (s.percentagegrade != null) {
    return 'Reviewed';
  }
  if (s.id) {
    return 'Submitted';
  }
  if (moment().isAfter(endDate)) {
    return 'Not Submitted';
  }
  return 'Open';
};

const getGrade = (s, endDate) => {
  if (s.percentagegrade) {
    return s.percentagegrade;
  }
  if (moment().isAfter(endDate)) {
    return 0;
  }
  return '-';
};

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
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [gradesPublished, setGradesPublished] = useState(false);

  // get homework data from the api
  const { data: homeworkData, error: errorHomework } = useOnErrorAlert(useHomework(homeworkId));
  useEffect(() => {
    if (typeof homeworkData !== 'undefined') {
      setTitle(homeworkData.homeworkName);
      setStartDate(homeworkData.solutionStart);
      setEndDate(homeworkData.solutionEnd);
      setSolutions(homeworkData.solutions);
      setUsersWithoutSolution(homeworkData.usersWithoutSolution);
      setButtonsDisabled(false);
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

  const canSubmit = isStudent(role) && moment().isBetween(startDate, endDate);

  const solutSafariFixedIonItems = [...solutions, ...usersWithoutSolution]
    .filter((u) => u.firstname.concat(u.lastname).toLowerCase().includes(searchTermUsers.toLowerCase()))
    .map((s) => {
      // return element list with solution items
      return (
        <div style={{ width: '100%' }}>
          <SafariFixedIonItem key={s.userId}>
            <IonCol className="ion-align-self-center">
              <IonLabel position="float">
                <Link href={`/users/${s.userid}`}>
                  <a>
                    {`${s.firstname} ${s.lastname}`}
                  </a>
                </Link>
              </IonLabel>
            </IonCol>
            <IonCol className="ion-align-self-center">
              <IonLabel position="float">{getStatus(s, endDate)}</IonLabel>
            </IonCol>
            <IonCol className="ion-align-self-center">
              <IonLabel position="float">{getGrade(s, endDate)}</IonLabel>
            </IonCol>
            {canSubmit && !s.id ? (
              <IonButton position="float" href={`/homeworks/${homeworkId}/submission`}>SUBMIT</IonButton>
            ) : (
              <IonButton position="float" href={`/homeworks/${homeworkId}/${s.userid}`} disabled={!s.id}>VIEW</IonButton>
            )}
          </SafariFixedIonItem>
        </div>
      );
    });
  /**
   * calls API to publish Grades of homework with corresponding homeworkId
   */
  const dopublishgrades = async () => {
    try {
      // send the data to the api and show the loading component in
      // the meantime to inform user and prevent double requests
      setUpdateLoading(true);
      await homeworksPublishGrades(homeworkId);
      setUpdateLoading(false);
      setGradesPublished(true);
      return makeToast({ message: 'Grades have been published.' });
    } catch (ex) {
      return makeAPIErrorAlert(ex);
    }
  };
  /**
   *
   */
  function submitgradebutton() {
    if (moment() > moment(homeworkData?.reviewEnd)) {
      if (homeworkData?.gradesPublished) {
        return false;
      }
      return (
        <IonButton disabled={gradesPublished} onClick={dopublishgrades}>
          Publish Grades
        </IonButton>
      );
    }
    return (
      <IonButton disabled>
        Publish Grades
      </IonButton>
    );
  }

  return (
    <AppPage title={`Homework: ${title}`}>
      <IonLoading isOpen={(!homeworkData && !errorHomework) || updateLoading} />
      <Expandable
        header="Homework Information"
        ionIcon={bookmarkOutline}
        isButtonDisabled={buttonsDisabled}
      >
        <SafariFixedIonItem>
          <IonLabel position="float" style={{ fontWeight: 'bold' }}>
            Homework:
          </IonLabel>
          <IonLabel position="float">
            {title}
          </IonLabel>
        </SafariFixedIonItem>
        <SafariFixedIonItem>
          <IonLabel position="float" style={{ fontWeight: 'bold' }}>
            Solution Upload Timeframe (Start):
          </IonLabel>
          <IonLabel position="float">
            {moment(startDate).format('DD.MM.YYYY - HH:mm')}
          </IonLabel>
        </SafariFixedIonItem>
        <SafariFixedIonItem>
          <IonLabel position="float" style={{ fontWeight: 'bold' }}>
            Solution Upload Timeframe (End):
          </IonLabel>
          <IonLabel position="float">
            {moment(endDate).format('DD.MM.YYYY - HH:mm')}
          </IonLabel>
        </SafariFixedIonItem>
        <SafariFixedIonItem>
          <IonLabel position="float" style={{ fontWeight: 'bold' }}>
            Review Timeframe (Start):
          </IonLabel>
          <IonLabel position="float">
            {moment(homeworkData?.reviewStart).format('DD.MM.YYYY - HH:mm')}
          </IonLabel>
        </SafariFixedIonItem>
        <SafariFixedIonItem>
          <IonLabel position="float" style={{ fontWeight: 'bold' }}>
            Review Timeframe (End):
          </IonLabel>
          <IonLabel position="float">
            {moment(homeworkData?.reviewEnd).format('DD.MM.YYYY - HH:mm')}
          </IonLabel>
        </SafariFixedIonItem>
      </Expandable>
      <SafariFixedIonItem>
        <IonIcon class="ion-padding" icon={downloadOutline} color="dark" />
        <IonLabel><h2>Download Task</h2></IonLabel>
        <form method="get" action={`/api/homeworks/downloadTask?homeworkId=${homeworkId}`}>
          <IonButton type="submit" disabled={buttonsDisabled}>
            Download
            <input type="hidden" name="homeworkId" value={homeworkId ?? '-'} />
          </IonButton>
        </form>
      </SafariFixedIonItem>
      <Expandable
        header="Submitted Solutions"
        extra={isLecturer(role) && (
        <div>
          {submitgradebutton()}
          {' '}
        </div>
        )}
        ionIcon={checkboxOutline}
        isButtonDisabled={buttonsDisabled}
      >
        {isLecturer(role) && <IonSearchbar placeholder="Search for solution" value={searchTermUsers} onIonChange={handleChangeSearch} />}
        <IonList>
          <div style={{ width: '100%' }}>
            <SafariFixedIonItem>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonLabel className="ion-text-wrap" style={{ fontWeight: 'bold' }} position="float">Student</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel className="ion-text-wrap" style={{ fontWeight: 'bold' }} position="float">Status </IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel className="ion-text-wrap" style={{ fontWeight: 'bold' }} position="float">Score (%) </IonLabel>
                  </IonCol>
                  <div style={{ width: 51.88 }} />
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
