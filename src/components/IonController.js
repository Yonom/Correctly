import { Controller } from 'react-hook-form';
import { useEffect, useRef, useState, cloneElement, createElement, isValidElement } from 'react';
import { IonButton, IonItemGroup } from '@ionic/react';

const IonController = ({ name, control, as, render, defaultValue = '', rules, onFocus, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={render || (({ onChange, onBlur, value }) => {
        const asProps = { onIonChange: onChange, onIonBlur: onBlur, value, name, ...props };
        if (isValidElement(as)) {
          return cloneElement(as, asProps);
        }

        return createElement(as, asProps, null);
      })}
      defaultValue={defaultValue}
      rules={rules}
      onFocus={onFocus}
    />
  );
};

export default IonController;

export const IonFileButtonController = ({ name, rules, control, accept, multiple, children, ...rest }) => {
  const {
    setValue,
    register,
    unregister,
  } = control;
  const [initialRules] = useState(rules);
  const [files, setFiles] = useState([]);
  const inputEl = useRef();
  useEffect(() => {
    register({ name }, initialRules);
    return () => unregister(name);
  }, [name, initialRules, register, unregister]);

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
