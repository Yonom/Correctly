import { IonCard, IonCardHeader, IonCardTitle, IonItemDivider, IonCardContent, IonGrid } from '@ionic/react';

import Homework from './Homework';

const Tasks = ({ title, homeworklist }) => {
  const homeworks = [];

  homeworklist.forEach((homework) => {
    homeworks.push(
      <Homework
        course={homework.course}
        type={homework.name}
        deadline={homework.doingend}
        id={homework.id}
      />,
    );
  });

  return (
    <IonCard style={{ background: '#F4F4F4' }}>
      <IonItemDivider>
        <IonCardHeader>
          <IonCardTitle className="" style={{ color: '#373A3C' }}>{title}</IonCardTitle>
        </IonCardHeader>
      </IonItemDivider>
      <IonCardContent>
        <IonGrid>
          {homeworks}
        </IonGrid>
      </IonCardContent>
    </IonCard>

  );
};
export default Tasks;
