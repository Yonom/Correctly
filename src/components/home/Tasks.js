import { IonCard, IonCardHeader, IonCardTitle, IonItemDivider, IonCardContent } from '@ionic/react';

import Assigntment from './Assignment';

export default (props) => {
  const assignments = [];

  const { title } = props;
  const { assignmentlist } = props;

  assignmentlist.forEach((assignment) => {
    assignments.push(
      <Assigntment
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
        <ion-grid>
          {assignments}
        </ion-grid>
      </IonCardContent>
    </IonCard>

  );
};
