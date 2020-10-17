import { IonItem } from '@ionic/react';

const SafariFixedIonItem = ({ children, ...props }) => {
  return (
    <IonItem {...props}>
      {/* Safari bug workaround */}
      <div tabIndex="0" />
      {children}
    </IonItem>
  );
};

export default SafariFixedIonItem;
