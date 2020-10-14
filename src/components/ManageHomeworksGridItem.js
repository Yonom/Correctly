import { IonGrid, IonItem, IonRow, IonCol, IonLabel, IonButton } from '@ionic/react';
import styles from './ManageCoursesGridItem.module.css';

const ManageHomeworksGridItem = ({ homework, header = false, showEditBtn = false, showShowBtn = false }) => {
  const itemClass = header
    ? styles.header
    : null;

  const editBtn = showEditBtn
    ? <IonButton className={styles.button} href={`./homeworks/edit?id=${homework.id}`}>EDIT</IonButton>
    : null;

  const showBtn = showShowBtn
    ? <IonButton className={styles.button} href={`../../homeworks/${homework.id}`}>SHOW</IonButton>
    : null;

  const doingStart = (`${homework.doingStart.split('T')[0]} ${homework.doingStart.split('T')[1].substring(0, 5)}`);
  const doingEnd = (`${homework.doingEnd.split('T')[0]} ${homework.doingEnd.split('T')[1].substring(0, 5)}`);
  const correctingStart = (`${homework.correctingStart.split('T')[0]} ${homework.correctingStart.split('T')[1].substring(0, 5)}`);
  const correctingEnd = (`${homework.correctingEnd.split('T')[0]} ${homework.correctingEnd.split('T')[1].substring(0, 5)}`);

  return (
    <IonItem className={itemClass}>
      <IonGrid>
        <IonCol>
          <IonRow>
            <IonCol>
              <IonLabel position="float" className="ion-text-wrap">{`${homework.homeworkName}`}</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel position="float" className="ion-text-wrap">{`${`${homework.yearcode} ${homework.title}`}`}</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel position="float" className="ion-text-wrap">{`${`${homework.firstName} ${homework.lastName}`}`}</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel position="float" className="ion-text-wrap">{`${`Solution Upload Timeframe: ${`${doingStart} - ${doingEnd}`}`}`}</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel position="float" className="ion-text-wrap">{`${`Review Upload Timeframe: ${`${correctingStart} - ${correctingEnd}`}`}`}</IonLabel>
            </IonCol>
          </IonRow>
        </IonCol>
      </IonGrid>
      <IonGrid>
        {editBtn}
        {showBtn}
      </IonGrid>
    </IonItem>
  );
};

export default ManageHomeworksGridItem;
