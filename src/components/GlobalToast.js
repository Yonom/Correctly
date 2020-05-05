import { createContext, useState, useContext } from 'react';
import { IonToast } from '@ionic/react';

const ToastContext = createContext();

export const useToaster = () => {
  return useContext(ToastContext);
};

export const GlobalToastProvider = ({ children }) => {
  const [currentToast, setCurrentToast] = useState();
  let currentToastEl;
  if (currentToast) {
    currentToastEl = (
      <IonToast
        duration={5000}
        {...currentToast}
        isOpen
        onDidDismiss={() => setCurrentToast(null)}
      />
    );
  }

  return (
    <ToastContext.Provider value={setCurrentToast}>
      {children}
      {currentToastEl}
    </ToastContext.Provider>
  );
};
