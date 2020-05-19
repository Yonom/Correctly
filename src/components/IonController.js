import { Controller } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { IonButton } from '@ionic/react';

export default (props) => {
  return (
    <Controller
      onBlurName="onIonBlur"
      onChangeName="onIonChange"
      onChange={([e]) => {
        return e.detail.value;
      }}
      {...props}
    />
  );
};

export const IonFileButtonController = ({ name, rules, control, accept, children }) => {
  const {
    setValue,
    register,
    unregister,
  } = control;

  const inputEl = useRef();
  useEffect(() => {
    register({ name }, rules);
    return () => unregister(name);
  }, [name, rules, register, unregister]);

  const handleButtonClick = () => {
    inputEl.current.click();
  };

  const fileChange = (e) => {
    setValue(name, e.target.files);
  };

  return (
    <IonButton onClick={handleButtonClick}>
      <input
        hidden
        accept={accept}
        type="file"
        ref={inputEl}
        onChange={fileChange}
      />
      {children}
    </IonButton>
  );
};
