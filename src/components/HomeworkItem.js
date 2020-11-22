import { IonLabel, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import moment from 'moment';
import styles from './HomeworkItem.module.css';
import SafariFixedIonItem from './SafariFixedIonItem';

const HomeworkItem = ({ homework, canEdit, canSubmit }) => {
  return (
    <div style={{ width: '100%' }}>
      <SafariFixedIonItem key={homework.homeworkId}>
        <IonGrid>
          <IonRow>
            <IonCol size="5" className="ion-align-self-center">
              <IonLabel position="float" class="item-text-wrap">{`${homework.homeworkname}`}</IonLabel>
            </IonCol>
            <IonCol size="5" className="ion-align-self-center">
              <IonLabel position="float" class="item-text-wrap">{moment(homework.solutionend).format('DD.MM.YYYY - HH:mm')}</IonLabel>
            </IonCol>
            <IonCol size="2">
              {canEdit && (
                <IonButton className={styles.button} position="float" href={`/manage/homeworks/edit?id=${homework.id}`}>EDIT</IonButton>
              )}
              <IonButton className={styles.button} position="float" href={`/homeworks/${homework.id}`} disabled={!homework.visible}>VIEW</IonButton>
              {canSubmit && (
                <IonButton className={styles.button} position="float" href={`/homeworks/${homework.id}/submission`}>SUBMIT</IonButton>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </SafariFixedIonItem>
    </div>
  );
};

export default HomeworkItem;
