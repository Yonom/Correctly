import { useState } from 'react';
import { IonToast, IonAlert } from '@ionic/react';

let globalSetCurrentNotification;
let notificationCounter = 0;

const makeNotification = (Element, { onDidDismiss, ...props }) => {
  notificationCounter += 1;
  const id = notificationCounter;

  const dismiss = () => {
    if (id !== notificationCounter) return;
    globalSetCurrentNotification();
  };

  const promise = new Promise((resolve) => {
    const dismissHandler = () => {
      resolve();
      if (onDidDismiss) onDidDismiss();
    };

    globalSetCurrentNotification({
      Element,
      props: {
        ...props,
        key: id,
        onDidDismiss: dismissHandler,
      },
    });
  });

  promise.dismiss = dismiss;

  return promise;
};

export const makeToast = (props) => {
  return makeNotification(IonToast, {
    duration: 5000,
    isOpen: true,
    ...props,
  });
};

export const makeAlert = (props) => {
  return makeNotification(IonAlert, {
    buttons: ['OK'],
    isOpen: true,
    ...props,
  });
};

export const GlobalNotificationsProvider = () => {
  const [currentNotification, setCurrentNotification] = useState();
  globalSetCurrentNotification = setCurrentNotification;

  if (!currentNotification) return null;
  const { Element, props } = currentNotification;
  return <Element {...props} />;
};
