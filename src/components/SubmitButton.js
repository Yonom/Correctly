import { IonButton } from '@ionic/react';

const SubmitButton = ({ children, ...rest }) => {
  return (
    <>
      <button type="submit" style={{ visibility: 'hidden' }}>{children}</button>
      <IonButton {...rest}>{children}</IonButton>
    </>
  );
};

export default SubmitButton;
