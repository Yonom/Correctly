import { IonCard, IonCardHeader, IonCardTitle, IonItemDivider, IonCardContent, IonGrid } from '@ionic/react';

import Homework from './Homework';

const Tasks = ({ title, homeworklist }) => {
  const homeworks = [];

  homeworklist?.forEach((homework) => {
    homeworks.push(
      <Homework
        key={homework.id}
        course={homework.title}
        name={homework.homeworkname}
        deadline={homework.doingend ?? homework.correctingend ?? homework.studentid}
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
