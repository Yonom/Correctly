import { IonButton, IonItem, IonLabel } from '@ionic/react';
import { useState, useEffect } from 'react';
import AppPage from '../../components/AppPage';

import { useOnErrorAlert } from '../../utils/errors';
import { useMyEditableCourses } from '../../services/courses';

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);

  // get course data from the api
  const { data: courseData } = useOnErrorAlert(useMyEditableCourses());

  useEffect(() => {
    if (typeof courseData !== 'undefined') {
      setCourses(courseData);
    }
  }, [courseData]);

  // dynamically build the course items with the corresponding course information and link to edit
  const courseItems = courses.map((c) => {
    return (
      <IonItem>
        <IonLabel position="float" class="item-text-wrap">{`${c.yearCode} ${c.title}`}</IonLabel>
        <IonButton position="float" href={`./courses/edit?id=${c.courseId}`}> SHOW</IonButton>
      </IonItem>
    );
  });

  return (
    <AppPage title="Manage Courses">
      {courseItems}
    </AppPage>
  );
};

export default MyCoursesPage;
