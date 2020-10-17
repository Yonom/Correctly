import { IonButton } from '@ionic/react';

const SubmitButton = ({ children, ...rest }) => {
  return (
    <>
      <button type="submit" style={{ display: 'none' }}>{children}</button>
      <IonButton {...rest} type="submit">{children}</IonButton>
    </>
  );
};

export default SubmitButton;
