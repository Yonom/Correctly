import { IonGrid, IonItem, IonRow, IonCol, IonLabel, IonButton } from '@ionic/react';
import styles from './ManageCoursesGridItem.module.css';

const ManageCoursesGridItem = ({ course, header = false, showAddBtn = false, showEditBtn = false, showShowBtn = false }) => {
  const itemClass = header
    ? styles.header
    : null;

  const addBtn = showAddBtn
    ? <IonButton className={styles.button} href="./courses/add">ADD</IonButton>
    : null;

  const editBtn = showEditBtn
    ? <IonButton className={styles.button} href={`./courses/edit?id=${course.courseId}`}>EDIT</IonButton>
    : null;

  const showBtn = showShowBtn
    ? <IonButton className={styles.button} href={`../../courses/${course.courseId}`}>SHOW</IonButton>
    : null;

  return (
    <IonItem className={itemClass}>
      <IonGrid>
        <IonRow>
          <IonCol size="3">
            <IonLabel position="float" className="ion-text-wrap">{`${course.yearCode}`}</IonLabel>
          </IonCol>
          <IonCol size="6">
            <IonLabel position="float" className="ion-text-wrap">{`${course.title}`}</IonLabel>
          </IonCol>
          <IonCol size="3">
            {addBtn}
            {editBtn}
            {showBtn}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default ManageCoursesGridItem;
