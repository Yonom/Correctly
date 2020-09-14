import { IonCard, IonCardHeader, IonCardTitle, IonItemDivider, IonCardContent, IonGrid } from '@ionic/react';

import Assignment from './Assignment';

const Tasks = ({ title, assignmentlist }) => {
  const assignments = [];

  assignmentlist.forEach((assignment) => {
    assignments.push(
      <Assignment
        course={assignment.course}
        type={assignment.type}
        deadline={assignment.deadline}
        id={assignment.id}
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
          {assignments}
        </IonGrid>
      </IonCardContent>
    </IonCard>

  );
};
export default Tasks;
