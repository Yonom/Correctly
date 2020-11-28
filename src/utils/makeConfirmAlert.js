import { makeAlert } from '../components/GlobalNotifications';

const makeConfirmAlert = (message, okLabel = 'Submit') => {
  return new Promise((resolve, reject) => {
    makeAlert({
      header: 'Are you sure?',
      message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: reject,
        },
        {
          text: okLabel,
          handler: resolve,
        },
      ],
    });
  });
};

export default makeConfirmAlert;
