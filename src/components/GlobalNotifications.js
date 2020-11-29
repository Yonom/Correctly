import { useEffect, useState } from 'react';
import { IonToast, IonAlert, IonLoading } from '@ionic/react';
import useSWR from 'swr';

let globalSetCurrentNotification;
let globalSetIsLoadingCount;
let notificationCounter = 0;

const startLoading = () => {
  globalSetIsLoadingCount((c) => c + 1);
};
const stopLoading = () => {
  globalSetIsLoadingCount((c) => c - 1);
};

export const withLoading = (callback) => {
  return async (...args) => {
    startLoading();
    try {
      return await callback?.(...args);
    } finally {
      stopLoading();
    }
  };
};

export const useLoadingSWR = (...args) => {
  const res = useSWR(...args);
  const loading = !res.data && !res.error;
  useEffect(() => {
    if (loading) {
      startLoading();
      return stopLoading;
    }

    return null;
  }, [loading]);
  return res;
};

const makeNotification = (Element, props) => {
  notificationCounter += 1;
  const id = notificationCounter;

  const dismiss = () => {
    if (id !== notificationCounter) return;
    globalSetCurrentNotification(null);
  };

  const promise = new Promise((resolve) => {
    const dismissHandler = () => {
      dismiss();
      resolve();
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

  const [isLoadingCount, setIsLoadingCount] = useState(0);
  globalSetIsLoadingCount = setIsLoadingCount;

  if (!currentNotification) {
    if (isLoadingCount === 0) return null;
    return <IonLoading isOpen />;
  }
  const { Element, props } = currentNotification;
  return <Element {...props} />;
};
