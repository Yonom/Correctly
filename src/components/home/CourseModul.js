import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonButton } from '@ionic/react';

const CourseModul = ({ course }) => {
  const link = `/courses/${course.id}/`;
  return (
    <IonCard color="secondary">
      <IonCardHeader>
        <IonCardSubtitle color="secondary">{course.yearcode}</IonCardSubtitle>
        <IonCardTitle color="secondary">{course.title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton expand="full" color="tertiary" href={link}>
          open course
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default CourseModul;
