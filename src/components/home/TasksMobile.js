import { IonItem, IonLabel, IonBadge } from '@ionic/react';

const TasksMobile = ({ title, assignmentlist }) => {
  const { length } = assignmentlist;

  return (
    <IonItem>
      <IonLabel>{title}</IonLabel>
      <IonBadge color="danger" slot="end">{length}</IonBadge>
    </IonItem>
  );
};

export default TasksMobile;
