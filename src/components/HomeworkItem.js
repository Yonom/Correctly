import { IonLabel, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import styles from './HomeworkItem.module.css';
import SafariFixedIonItem from './SafariFixedIonItem';

const HomeworkItem = ({ homework }) => {
  /**
   * returns a readable date string for a given unix timestamp
   *
   * @param {object} unixTimestamp the timestamp for which a date string should be returned.
   *
   */
  const getDate = (unixTimestamp) => {
    /**
     * @param {number} n number to format
     */
    function formatTwoDigits(n) {
      return n < 10 ? `0${n}` : n;
    }
    const d = new Date(Number(unixTimestamp) * 1000);
    const date = `${d.getDate()}.${d.getMonth()}.${d.getFullYear()}`;
    const time = `${d.getHours()}:${formatTwoDigits(d.getMinutes())}`;

    return `${date}, by ${time}`;
  };

  return (
    <div style={{ width: '100%' }}>
      <SafariFixedIonItem key={homework.homeworkId}>
        <IonGrid>
          <IonRow>
            <IonCol size="5">
              <IonLabel position="float" class="item-text-wrap">{`${homework.homeworkname}`}</IonLabel>
            </IonCol>
            <IonCol size="5">
              <IonLabel position="float" class="item-text-wrap">{`${getDate(homework.doingend)}`}</IonLabel>
            </IonCol>
            <IonCol size="2">
              <IonButton className={styles.button} position="float" href={`/homeworks/${homework.id}`}>SHOW</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </SafariFixedIonItem>
    </div>
  );
};

export default HomeworkItem;
