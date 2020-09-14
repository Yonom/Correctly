import { IonCard, IonList, IonListHeader } from '@ionic/react';

<<<<<<< HEAD

export default ({ title, content }) => {
=======
const OverviewList = ({ title, content }) => {
>>>>>>> master
  return (
    <IonCard>
      <IonList>
        <IonListHeader style={{ color: '#72993E' }}><h3>{title}</h3></IonListHeader>
        {content}
      </IonList>
    </IonCard>
  );
};
<<<<<<< HEAD
=======

export default OverviewList;
>>>>>>> master
