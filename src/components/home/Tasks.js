import { IonItemGroup, IonLabel, IonItemDivider } from '@ionic/react';
import Homework from './Homework';

const Tasks = ({ title, homeworklist, type }) => {
  const homeworks = [];

  homeworklist?.forEach((homework) => {
    homeworks.push(
      <Homework
        type={type}
        id={homework.id}
        key={`${homework.id} ${homework.userid}`}
        userId={homework.userid}
        solutionId={homework.solutionid}
        course={homework.title}
        name={homework.homeworkname}
        deadline={homework.solutionend ?? homework.reviewend}
        reason={homework.reason}
        plagiarismid={homework.plagiarismid}
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
