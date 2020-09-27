import { IonCard, IonCardContent, IonRow, IonCol, IonGrid } from '@ionic/react';

const CourseModul = ({ course }) => {
  return (
    <IonCard style={{ background: '#F4F4F4' }}>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size={12}>
              <div className="ion-text-center" style={{ color: '#373A3C' }}><b>{course.title}</b></div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size={12}>
              <div className="ion-text-center" style={{ color: '#373A3C' }}>{course.yearcode}</div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default CourseModul;
