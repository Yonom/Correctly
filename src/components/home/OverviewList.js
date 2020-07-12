import { IonCard, IonList, IonListHeader } from '@ionic/react';

export default ({ title, content }) => {
  return (
    <IonCard>
      <IonList>
        <IonListHeader style={{ color: '#72993E' }}><h3>{title}</h3></IonListHeader>
        {content}
      </IonList>
    </IonCard>
  );
};
