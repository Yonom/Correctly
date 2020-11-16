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
import { useMyData } from '../../services/auth';
import { isLecturer } from '../../utils/auth/role';
import { useCourse, useCourseCSV } from '../../services/courses';
import HomeworkItem from '../../components/HomeworkItem';
import SafariFixedIonItem from '../../components/SafariFixedIonItem';

const ViewCoursePage = () => {
  // initialize router
  const router = useRouter();
  const { courseId } = router.query;

  // initialize state variables
  const [title, setTitle] = useState('');
  const [yearCode, setYearCode] = useState('');

  const [courseCSV, setCSVData] = useState([]);

  const [users, setUsers] = useState([]);
  const [homeworks, setHomeworks] = useState([]);

  const [searchTermUsers, setSearchTermUsers] = useState('');

  const { data: userrole } = useMyData();
  const role = userrole?.role;

  const csvHeaders = [
    { label: 'Homework ID', key: 'id' },
    { label: 'User ID', key: 'userid' },
    { label: 'Homework Name', key: 'homeworkname' },
    { label: 'Course Name', key: 'title' },
    { label: 'Year Code', key: 'yearcode' },
    { label: 'Student Name', key: 'name' },
    { label: 'Maximum Points possible', key: 'maxreachablepoints' },
    { label: 'Performance in %', key: 'percentagegrade' },
    { label: 'Actual points earned', key: 'actualpointsearned' },
  ];

  // get course data from the api
  const { data: courseData } = useOnErrorAlert(useCourse(courseId));
  const { data: courseCSVData } = useOnErrorAlert(useCourseCSV(courseId));

  useEffect(() => {
    if (typeof courseCSVData !== 'undefined') {
      setCSVData(courseCSVData);
    }
  }, [courseCSVData]);

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
        extra={isLecturer(role) && (
          <CSVLink
            headers={csvHeaders}
            data={courseCSV}
            separator=";"
            enclosingCharacter={'"'}
            filename={`Export_${title}_${yearCode}.csv`}
          >
            <IonButton>Export CSV</IonButton>
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
