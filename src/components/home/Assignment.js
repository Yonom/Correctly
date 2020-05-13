import {} from '@ionic/react';

export default (props) => {
  const { type } = props;
  const { course } = props;
  const { deadline } = props;
  return (
    <ion-row>
      <ion-col>
        {type}
      </ion-col>
      <ion-col>
        {course}
      </ion-col>
      <ion-col>
        {deadline}
      </ion-col>
      <ion-col>
        Ansehen >
      </ion-col>
    </ion-row>
  );
};
