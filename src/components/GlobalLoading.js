import { useEffect, useState } from 'react';
import { IonLoading } from '@ionic/react';
import useSWR from 'swr';

let globalSetIsLoadingCount;

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
      await callback?.(...args);
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

export const GlobalLoadingProvider = () => {
  const [isLoadingCount, setIsLoadingCount] = useState(0);
  globalSetIsLoadingCount = setIsLoadingCount;

  if (isLoadingCount === 0) return null;
  return <IonLoading isOpen />;
};
