import { } from '@ionic/react';


export default (props) => {
  const { content } = props;
  const { cardWidth } = props;
  return (
    <ion-grid>
      <ion-row>
        {content.map((value) => {
        /* map items and start new row after 3 */
          return <ion-col size-xl={cardWidth} size-sm={12}>{value}</ion-col>;
        })}
      </ion-row>
    </ion-grid>
  );
};
