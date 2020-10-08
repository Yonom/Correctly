import { IonList } from '@ionic/react';
import { useState, useEffect } from 'react';
import AppPage from '../../components/AppPage';
import ManageCoursesGridItem from '../../components/ManageCoursesGridItem';

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
  const courseItems = courses.map((course) => {
    return (
      <ManageCoursesGridItem
        key={course.courseId}
        course={course}
        showEditBtn
        showShowBtn
      />
    );
  });

  return (
    <AppPage title="Manage Courses">
      <IonList>
        <ManageCoursesGridItem
          key="header"
          course={{ title: 'Course Title', courseId: '', yearCode: 'Year Code' }}
          showAddBtn
          header
        />
        {courseItems}
      </IonList>
    </AppPage>
  );
};

export default MyCoursesPage;
