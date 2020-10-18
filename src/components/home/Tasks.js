import { IonItemGroup, IonLabel, IonItemDivider } from '@ionic/react';

import Homework from './Homework';

const Tasks = ({ title, homeworklist, type }) => {
  const homeworks = [];

  homeworklist?.forEach((homework) => {
    homeworks.push(
      <Homework
        type={type}
        id={homework.id}
        key={homework.id}
        course={homework.title}
        name={homework.homeworkname}
        deadline={homework.solutionend ?? homework.reviewend}
        studentId={homework.studentid}
      />,
    );
  });

  return (
    <div>
      <IonItemGroup>
        <IonItemDivider>
          <IonLabel style={{ fontSize: 22 }}>
            {title}
          </IonLabel>
        </IonItemDivider>
        {homeworks}
      </IonItemGroup>
    </div>
  );
};
export default Tasks;
