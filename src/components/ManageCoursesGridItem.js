import { IonGrid, IonRow, IonCol, IonLabel, IonButton } from '@ionic/react';
import styles from './ManageCoursesGridItem.module.css';
import SafariFixedIonItem from './SafariFixedIonItem';

const ManageCoursesGridItem = ({ course, header = false, showAddBtn = false, showEditBtn = false, showShowBtn = false }) => {
  const itemClass = header
    ? styles.header
    : null;

  const addBtn = showAddBtn
    ? <IonButton className={styles.addButton} href="./courses/add">New course</IonButton>
    : null;

  const editBtn = showEditBtn
    ? <IonButton className={styles.button} href={`./courses/edit?id=${course.courseId}`}>EDIT</IonButton>
    : null;

  const showBtn = showShowBtn
    ? <IonButton className={styles.button} href={`../../courses/${course.courseId}`}>SHOW</IonButton>
    : null;

  return (
    <SafariFixedIonItem className={itemClass}>
      <IonGrid>
        <IonRow>
          <IonCol size="3" className="ion-align-self-center">
            <IonLabel style={{ fontWeight: header ? 'bold' : undefined }} position="float" className="ion-text-wrap">{`${course.yearCode}`}</IonLabel>
          </IonCol>
          <IonCol size="6" className="ion-align-self-center">
            <IonLabel style={{ fontWeight: header ? 'bold' : undefined }} position="float" className="ion-text-wrap">{`${course.title}`}</IonLabel>
          </IonCol>
          <IonCol size="3">
            {addBtn}
            {editBtn}
            {showBtn}
          </IonCol>
        </IonRow>
      </IonGrid>
    </SafariFixedIonItem>
  );
};

export default ManageCoursesGridItem;
