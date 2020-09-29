import { IonItem, IonLabel, IonText } from '@ionic/react';

import Homework from './Homework';

const Tasks2 = ({ title, homeworklist }) => {
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
    <div>
      <IonItem>
        <IonLabel>
          {title}
        </IonLabel>
      </IonItem>

      <IonItem>
        <IonLabel className="ion-text-wrap">
          <IonText color="primary">
            {homeworks}
          </IonText>
        </IonLabel>
      </IonItem>
    </div>
  );
};
export default Tasks2;
