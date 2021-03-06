import { IonButton } from '@ionic/react';
import Router from 'next/router';
import makeConfirmAlert from '../utils/makeConfirmAlert';
import { withLoading } from './GlobalNotifications';

const RedoButton = ({ className, homeworkId }) => {
  const redoHandler = withLoading(async () => {
    try {
      await makeConfirmAlert('If you redo the submission, your original submission will be overwritten and cannot be restored.', 'Continue');
    } catch {
      // user cancelled request
      return;
    }
    Router.push(`/homeworks/${homeworkId}/submission`);
  });
  return (
    <IonButton className={className} position="float" onClick={redoHandler}>REDO SUBMISSION</IonButton>
  );
};

export default RedoButton;
