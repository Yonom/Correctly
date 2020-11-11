/* Ionic imports */
import { IonCol, IonGrid, IonButton, IonLabel, IonList, IonRow, IonSearchbar } from '@ionic/react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { CSVLink } from 'react-csv';

import { homeOutline, peopleOutline, bookmarksOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import AppPage from '../../components/AppPage';

import Expandable from '../../components/Expandable';

import { useOnErrorAlert } from '../../utils/errors';
import { useCourse } from '../../services/courses';
import HomeworkItem from '../../components/HomeworkItem';
import SafariFixedIonItem from '../../components/SafariFixedIonItem';

const ViewCoursePage = () => {
  // initialize router
  const router = useRouter();
  const { courseId } = router.query;

  // initialize state variables
  const [title, setTitle] = useState('');
  const [yearCode, setYearCode] = useState('');

  const [users, setUsers] = useState([]);
  const [homeworks, setHomeworks] = useState([]);

  const [searchTermUsers, setSearchTermUsers] = useState('');

  const csvHeaders = [
    { label: 'Homework ID', key: 'homeworks.homeworksId' },
    { label: 'User ID', key: 'homeworks.userId' },
    { label: 'Homework Name', key: 'homeworks.title' },
    { label: 'Course Name', key: 'homeworks.homeworkName' },
    { label: 'Year Code', key: 'homeworks.yearcode' },
    { label: 'Student First Name', key: 'homeworks.firstName' },
    { label: 'Student Last Name', key: 'homeworks.lastName' },
    { label: 'Maximum Points possible', key: 'homeworks.maxReachablePoints' },
    { label: 'Performance in %', key: 'homeworks.percentageGrade' },
  ];

  const csvData = [
    { homeworks: { homeworksId: '12332', userId: '828282', title: 'First Assesment of Programming Skills', homeworkName: 'Einführung in die Programmierung', yearcode: 'WI-DIF-172', maxReachablePoints: '20', percentageGrade: '66.8', firstName: 'Ahmed', lastName: 'Tomi' } },
    { homeworks: { homeworksId: '12334', userId: '828282', title: 'Second Assesment of Programming Skills', homeworkName: 'Einführung in die Programmierung', yearcode: 'WI-DIF-172', maxReachablePoints: '20', percentageGrade: '33.9', firstName: 'Ahmed', lastName: 'Tomi' } },
  ];

  // get course data from the api
  const { data: courseData } = useOnErrorAlert(useCourse(courseId));
  useEffect(() => {
    if (typeof courseData !== 'undefined') {
      setTitle(courseData.title);
      setYearCode(courseData.yearcode);
      setUsers(courseData.attendees);
      setHomeworks(courseData.homeworks);
    }
  }, [courseData]);

  /**
   * returns a readable role string for a given user
   *
   * @param {object} user the user for which a role string should be returned.
   *
   */
  const getRole = (user) => {
    const roles = [];
    if (user.ismodulecoordinator) roles.push('Module Coordinator');
    if (user.islecturer) roles.push('Lecturer');
    if (user.isstudent) roles.push('Student');
    return roles.join(', ');
  };

  const handleChangeSearch = (event) => {
    setSearchTermUsers(event.target.value);
  };

  const userItems = users.filter((u) => u.firstname.concat(u.lastname).toLowerCase().includes(searchTermUsers.toLowerCase())).map((u) => {
    // return element list with user items
    return (
      <div style={{ width: '100%' }}>
        <SafariFixedIonItem key={u.userId}>
          <IonLabel position="float">
            <Link href={`/users/${u.userid}`}>
              <a>
                {`${u.firstname} ${u.lastname}`}
              </a>
            </Link>
          </IonLabel>
          <IonLabel position="float">{getRole(u)}</IonLabel>
        </SafariFixedIonItem>
      </div>
    );
  });

  const homeworkItems = homeworks.map((h) => {
    // return element list with homework items
    return (
      <HomeworkItem homework={h} />
    );
  });

  return (
    <AppPage title={`Course: ${title}`}>
      <Expandable
        header="Home"
        ionIcon={homeOutline}
      >
        <SafariFixedIonItem>
          <IonLabel position="float">
            Course Title
          </IonLabel>
          <IonLabel position="float">
            {title}
          </IonLabel>
        </SafariFixedIonItem>
        <SafariFixedIonItem>
          <IonLabel position="float">
            Year Code
          </IonLabel>
          <IonLabel position="float">
            {yearCode}
          </IonLabel>
        </SafariFixedIonItem>
      </Expandable>
      <Expandable
        header="People"
        ionIcon={peopleOutline}
      >
        <IonSearchbar placeholder="Filter by name" value={searchTermUsers} onIonChange={handleChangeSearch} />
        <IonList>
          {userItems}
        </IonList>
      </Expandable>
      <Expandable
        header="Homework"
        // extra={<IonButton onClick={() => exportCSV()}>CSV Export</IonButton>}
        extra={(
          <CSVLink
            headers={csvHeaders}
            data={csvData}
            separator=";"
            enclosingCharacter={'"'}
            filename="coursesAndHomeworks.csv"
          >
            <IonButton>Download CSV</IonButton>
          </CSVLink>
)}
        ionIcon={bookmarksOutline}
      >
        <IonList>
          <div style={{ width: '100%' }}>
            <SafariFixedIonItem>
              <IonGrid>
                <IonRow>
                  <IonCol size="5">
                    <IonLabel style={{ fontWeight: 'bold' }} position="float">Name</IonLabel>
                  </IonCol>
                  <IonCol size="5">
                    <IonLabel style={{ fontWeight: 'bold' }} position="float">Due Date </IonLabel>
                  </IonCol>
                  <IonCol size="2">
                    <IonLabel position="float" />
                  </IonCol>
                </IonRow>
              </IonGrid>
            </SafariFixedIonItem>
            {homeworkItems}
          </div>
        </IonList>
      </Expandable>
    </AppPage>
  );
};

export default ViewCoursePage;
