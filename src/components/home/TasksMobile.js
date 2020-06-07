import { } from '@ionic/react';


export default ({ title, assignmentlist }) => {
  const { length } = assignmentlist;

  return (
    <ion-item>
      <ion-label>{title}</ion-label>
      <ion-badge color="danger" slot="end">{length}</ion-badge>
    </ion-item>
  );
};
