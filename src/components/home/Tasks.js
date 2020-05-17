import { IonCard, IonCardHeader, IonCardTitle, IonItemDivider, IonCardContent } from '@ionic/react';

import Assigntment from './Assignment';

export default (props) => {
  const { title } = props;
  const { type } = props;
  const { course } = props;
  const { deadline } = props;
  return (
    <IonCard style={{ background: '#F4F4F4' }}>
      <IonItemDivider>
        <IonCardHeader>
          <IonCardTitle className="" style={{ color: '#373A3C' }}>{title}</IonCardTitle>
        </IonCardHeader>
      </IonItemDivider>
      <IonCardContent>
        <ion-grid>
          <Assigntment course={course} type={type} deadline={deadline} />
        </ion-grid>
      </IonCardContent>
    </IonCard>

  );
};
