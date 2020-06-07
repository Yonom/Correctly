import { IonCard } from '@ionic/react';


export default ({ title, content }) => {
  return (
    <IonCard>
      <ion-list>
        <ion-list-header style={{ color: '#72993E' }}><h3>{title}</h3></ion-list-header>
        {content}
      </ion-list>
    </IonCard>
  );
};
