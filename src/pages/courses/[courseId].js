/* Ionic imports */
import { IonButton, IonItem, IonLabel, IonList, IonSearchbar } from '@ionic/react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { homeOutline, peopleOutline, bookmarksOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import AppPage from '../../components/AppPage';

import Expandable from '../../components/Expandable';

import { useOnErrorAlert } from '../../utils/errors';
import { useCourse } from '../../services/courses';

import { useHomeworkForCourse } from '../../services/homework';

const ViewCoursePage = () => {
  // initialize router
  const router = useRouter();
  const { courseId } = router.query;

  const [title, setTitle] = useState('');
  const [yearCode, setYearCode] = useState('');
  const [users, setUsers] = useState([]);

  const [homeworks, setHomeworks] = useState('');

  const [searchTermUsers, setSearchTermUsers] = useState('');

  const { data: courseData, error: errorCourse } = useCourse(courseId);

  useEffect(() => {
    if (typeof courseData !== 'undefined') {
      setTitle(courseData.title);
      setYearCode(courseData.yearCode);
      setUsers(courseData.users);
    }
  }, [courseData]);

  const { data: homeworkData, error: errorHomework } = useHomeworkForCourse(courseId);

  useEffect(() => {
    if (typeof homeworkData !== 'undefined') {
      setHomeworks(homeworkData);
    }
  }, [homeworkData]);

  const getRole = (user) => {
    if (user.isModuleCoordinator) return 'Module Coordinator';
    if (user.isLecturer) return 'Lecturer';
    if (user.isStudent) return 'Student';
    return '';
  };

  const handleChangeSearch = (event) => {
    setSearchTermUsers(event.target.value);
  };

  const userItems = users.filter((u) => u.firstName.concat(u.lastName).toLowerCase().includes(searchTermUsers.toLowerCase())).map((u) => {
    // return element list with user items
    return (
      <div style={{ width: '100%' }}>
        <IonItem key={u.userId}>
          <IonLabel position="stacked">{`${u.firstName} ${u.lastName}`}</IonLabel>
          <IonLabel position="stacked">{getRole(u)}</IonLabel>
        </IonItem>
      </div>
    );
  });

  const homeworkItems = homeworks.map((h) => {
    // return element list with homework items
    return (
      <div style={{ width: '100%' }}>
        <IonItem key={h.homeworkId}>
          <IonLabel position="stacked">{`${h.homeworkName}`}</IonLabel>
          <IonButton>SHOW</IonButton>
        </IonItem>
      </div>
    );
  });

  return (
    <AppPage title={`Course: ${title}`}>
      <Expandable
        header="Home"
        ionIcon={homeOutline}
      >
        <IonItem>
          <IonLabel position="stacked">
            Course Title
          </IonLabel>
          <IonLabel position="stacked">
            {title}
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">
            Year Code
          </IonLabel>
          <IonLabel position="stacked">
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
          {homeworkItems}
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
