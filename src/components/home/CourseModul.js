import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonButton } from '@ionic/react';

const CourseModul = ({ course }) => {
  const link = `/courses/${course.id}/`;
  return (
    <IonCard color="primary">
      <IonCardHeader>
        <IonCardSubtitle color="">{course.yearcode}</IonCardSubtitle>
        <IonCardTitle color="">{course.title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton expand="full" color="medium" href={link}>
          open course
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default CourseModul;
