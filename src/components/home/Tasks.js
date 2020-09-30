import { IonItemGroup, IonLabel, IonItemDivider } from '@ionic/react';

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
      <IonItemGroup>
        <IonItemDivider>
          <IonLabel>
            {title}
          </IonLabel>
        </IonItemDivider>
        {homeworks}
      </IonItemGroup>
    </div>
  );
};
export default Tasks2;
