/* Ionic imports */
import { IonButton, IonCol, IonGrid, IonItem, IonLabel, IonList, IonRow, IonSearchbar } from '@ionic/react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { homeOutline, peopleOutline, bookmarksOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import AppPage from '../../components/AppPage';

import Expandable from '../../components/Expandable';

import { useOnErrorAlert } from '../../utils/errors';
import { useCourse } from '../../services/courses';
import HomeworkItem from '../../components/HomeworkItem';

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
    if (user.ismodulecoordinator) return 'Module Coordinator';
    if (user.islecturer) return 'Lecturer';
    if (user.isstudent) return 'Student';
    return '';
  };

  const handleChangeSearch = (event) => {
    setSearchTermUsers(event.target.value);
  };

  const userItems = users.filter((u) => u.firstname.concat(u.lastname).toLowerCase().includes(searchTermUsers.toLowerCase())).map((u) => {
    // return element list with user items
    return (
      <div style={{ width: '100%' }}>
        <IonItem key={u.userId}>
          <IonLabel position="float">
            <Link href={`/users/${u.userid}`}>
              <a>
                {`${u.firstname} ${u.lastname}`}
              </a>
            </Link>
          </IonLabel>
          <IonLabel position="float">{getRole(u)}</IonLabel>
        </IonItem>
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
        <IonItem>
          <IonLabel position="float">
            Course Title
          </IonLabel>
          <IonLabel position="float">
            {title}
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel position="float">
            Year Code
          </IonLabel>
          <IonLabel position="float">
            {yearCode}
          </IonLabel>
        </IonItem>
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
        header="Homeworks"
        ionIcon={bookmarksOutline}
      >
        <IonList>
          <div style={{ width: '100%' }}>
            <IonItem>
              <IonGrid>
                <IonRow>
                  <IonCol size="5">
                    <IonLabel position="float">Name</IonLabel>
                  </IonCol>
                  <IonCol size="5">
                    <IonLabel position="float">Due Date </IonLabel>
                  </IonCol>
                  <IonCol size="2">
                    <IonLabel position="float" />
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
            {homeworkItems}
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

export default ViewCoursePage;
