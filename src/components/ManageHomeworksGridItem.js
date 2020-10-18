import { IonGrid, IonRow, IonCol, IonLabel, IonButton, IonIcon } from '@ionic/react';
import moment from 'moment';
import { arrowForwardOutline } from 'ionicons/icons';
import styles from './ManageCoursesGridItem.module.css';
import SafariFixedIonItem from './SafariFixedIonItem';

const ManageHomeworksGridItem = ({ homework, header = false, showEditBtn = false, showShowBtn = false }) => {
  const itemClass = header
    ? styles.header
    : null;

  const editBtn = showEditBtn
    ? <IonButton className={styles.button} href={`./homeworks/edit?id=${homework.id}`}>EDIT</IonButton>
    : null;

  const showBtn = showShowBtn
    ? <IonButton className={styles.button} href={`../../homeworks/${homework.id}`}>VIEW</IonButton>
    : null;

  const solutionStart = moment(homework.solutionStart).format('DD.MM.YYYY - HH:mm');
  const solutionEnd = moment(homework.solutionEnd).format('DD.MM.YYYY - HH:mm');
  const reviewStart = moment(homework.reviewStart).format('DD.MM.YYYY - HH:mm');
  const reviewEnd = moment(homework.reviewEnd).format('DD.MM.YYYY - HH:mm');

  return (
    <SafariFixedIonItem className={itemClass}>
      <IonGrid>
        <IonCol>
          <IonRow>
            <IonCol>
              <IonLabel position="float" style={{ fontWeight: 'bold', fontSize: 20 }} className="ion-text-wrap">{homework.homeworkName}</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="5" size-lg>
              <IonLabel position="float" style={{ fontWeight: 'bold' }} className="ion-text-wrap">Homework: </IonLabel>
            </IonCol>
            <IonCol>
              <IonLabel position="float" className="ion-text-wrap">{homework.title}</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="5" size-lg>
              <IonLabel position="float" style={{ fontWeight: 'bold' }} className="ion-text-wrap">Yearcode: </IonLabel>
            </IonCol>
            <IonCol>
              <IonLabel position="float" className="ion-text-wrap">{homework.yearcode}</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="5" size-lg>
              <IonLabel position="float" style={{ fontWeight: 'bold' }} className="ion-text-wrap">Solution Upload Timeframe: </IonLabel>
            </IonCol>
            <IonCol>
              <IonLabel position="float" className="ion-text-wrap">
                {solutionStart}
                &nbsp; &nbsp;
                <IonIcon slot="start" icon={arrowForwardOutline} />
                &nbsp; &nbsp;
                {solutionEnd}
              </IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="5" size-lg>
              <IonLabel position="float" style={{ fontWeight: 'bold' }} className="ion-text-wrap">Review Upload Timeframe: </IonLabel>
            </IonCol>
            <IonCol>
              <IonLabel position="float" className="ion-text-wrap">
                {reviewStart}
                &nbsp; &nbsp;
                <IonIcon slot="start" icon={arrowForwardOutline} />
                &nbsp; &nbsp;
                {reviewEnd}
              </IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="5" size-lg>
              <IonLabel position="float" style={{ fontWeight: 'bold' }} className="ion-text-wrap">Created by: </IonLabel>
            </IonCol>
            <IonCol>
              <IonLabel position="float" className="ion-text-wrap">
                {homework.firstName}
                {' '}
                {homework.lastName}
              </IonLabel>
            </IonCol>
          </IonRow>
        </IonCol>
      </IonGrid>
      <IonGrid>
        {editBtn}
        {showBtn}
      </IonGrid>
    </SafariFixedIonItem>
  );
};

export default ManageHomeworksGridItem;
