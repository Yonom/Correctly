import { IonItemGroup, IonLabel, IonItemDivider } from '@ionic/react';

import Homework from './Homework';

const Tasks2 = ({ title, homeworklist }) => {
  const homeworks = [];

  homeworklist?.forEach((homework) => {
    homeworks.push(
      <Homework
        id={homework.id}
        key={homework.id}
        course={homework.title}
        name={homework.homeworkname}
        deadline={homework.doingend ?? homework.correctingend}
        studentId={homework.studentid}
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
