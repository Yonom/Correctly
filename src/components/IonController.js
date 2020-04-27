import { Controller } from 'react-hook-form';

export default (props) => {
  return (
    <Controller
      onBlurName="onIonBlur"
      onChangeName="onIonChange"
      {...props}
    />
  );
};
