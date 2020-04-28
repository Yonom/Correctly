import { Controller } from 'react-hook-form';

export default (props) => {
  return (
    <Controller
      onBlurName="onIonBlur"
      onChangeName="onIonChange"
      onChange={([e]) => {
        return e.detail.value;
      }}
      onBlur={([e]) => {
        return e.detail.value;
      }}
      {...props}
    />
  );
};
