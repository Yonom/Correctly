import { Controller } from 'react-hook-form';
import { useEffect, useRef, useState, cloneElement, createElement, isValidElement } from 'react';
import { IonButton, IonItemGroup } from '@ionic/react';

export default ({ name, control, as, defaultValue = '', rules, onFocus, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ onChange, onBlur, value }) => {
        const asProps = { onIonChange: onChange, onIonBlur: onBlur, value, name, ...props };
        if (isValidElement(as)) {
          return cloneElement(as, asProps);
        }

        return createElement(as, asProps, null);
      }}
      defaultValue={defaultValue}
      rules={rules}
      onFocus={onFocus}
    />
  );
};

export const IonFileButtonController = ({ name, rules, control, accept, multiple, children, ...rest }) => {
  const {
    setValue,
    register,
    unregister,
  } = control;
  const [files, setFiles] = useState([]);
  const inputEl = useRef();
  useEffect(() => {
    register({ name }, rules);
    return () => unregister(name);
  }, [name, rules, register, unregister]);

  const handleButtonClick = () => {
    inputEl.current.click();
  };

  const fileChange = (e) => {
    setFiles(e.target.files);
    setValue(name, e.target.files);
  };

  return (
    <IonItemGroup style={{ display: 'flex', alignItems: 'center' }}>
      <IonButton {...rest} onClick={handleButtonClick}>{children}</IonButton>
      {files.length > 0 && (
        <span>{files.length > 1 ? `${files.length} files` : files[0].name}</span>
      )}

      <input
        hidden
        accept={accept}
        multiple={multiple}
        type="file"
        ref={inputEl}
        onChange={fileChange}
      />
    </IonItemGroup>
  );
};
