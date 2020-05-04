import { createContext, useReducer, useContext } from 'react';
import { IonToast } from '@ionic/react';

const ToastContext = createContext();

const reducer = (_, payload) => {
  return payload;
};

export const useToaster = () => {
  return useContext(ToastContext);
};

export const GlobalToastProvider = ({ children }) => {
  const [[currentToast], dispatch] = useReducer(reducer, null);
  let currentToastEl;
  if (currentToast) {
    currentToastEl = (
      <IonToast
        duration={5000}
        {...currentToast}
        isOpen
        onDidDismiss={() => dispatch(null)}
      />
    );
  }

  return (
    <ToastContext.Provider value={dispatch}>
      {children}
      {currentToastEl}
    </ToastContext.Provider>
  );
};
