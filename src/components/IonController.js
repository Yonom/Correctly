import { Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { IonInput } from '@ionic/react';

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

export const IonFileInputController = ({ name, rules, control, ...rest }) => {
  const {
    setValue,
    register,
    unregister,
  } = control;

  useEffect(() => {
    register({ name }, rules);
    return () => unregister(name);
  }, [name, rules, register, unregister]);

  const fileChange = (e) => {
    setValue(name, e.target.value.files);
  };

  return <IonInput {...rest} type="file" onIonChange={fileChange} />;
};
