import { IonItem, IonLabel, IonBadge } from '@ionic/react';

export default ({ title, assignmentlist }) => {
  const { length } = assignmentlist;

  return (
    <IonItem>
      <IonLabel>{title}</IonLabel>
      <IonBadge color="danger" slot="end">{length}</IonBadge>
    </IonItem>
  );
};
