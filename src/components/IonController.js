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

export const IonFileButtonController = ({ name, rules, control, accept, multiple, children, fakeFileNames, ...rest }) => {
  const {
    setValue,
    register,
    unregister,
  } = control;
  const [initialRules] = useState(rules);
  const [files, setFiles] = useState();
  const [hasOwnValue, setHasOwnValue] = useState(false);
  const inputEl = useRef();
  useEffect(() => {
    register({ name }, initialRules);
    return () => unregister(name);
  }, [name, initialRules, register, unregister]);

  useEffect(() => {
    if (hasOwnValue || !fakeFileNames) return;
    setFiles(fakeFileNames.filter((f) => f).map((fakeName) => ({ name: fakeName })));
  }, [fakeFileNames, hasOwnValue]);

  const handleButtonClick = () => {
    inputEl.current.click();
  };

  const handleClearButtonClick = () => {
    inputEl.current.value = '';
    setFiles([]);
    setValue(name, undefined);
    setHasOwnValue(true);
  };

  const fileChange = (e) => {
    setFiles(e.target.files);
    setValue(name, e.target.files);
    setHasOwnValue(true);
  };

  const hasFiles = files?.length > 0;

  return (
    <IonItemGroup style={{ display: 'flex', alignItems: 'center' }}>
      {hasFiles && (
        <span>{files?.length > 1 ? `${files?.length} files` : files ? files[0].name : ''}</span>
      )}
      {!hasFiles && (
        <IonButton {...rest} onClick={handleButtonClick}>{children}</IonButton>
      )}
      {hasFiles && (
        <IonButton color="danger" {...rest} onClick={handleClearButtonClick}>Delete</IonButton>
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
