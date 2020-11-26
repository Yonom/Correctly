import { makeAlert } from '../components/GlobalNotifications';

const makeConfirmAlert = (message) => {
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
          text: 'Submit',
          handler: resolve,
        },
      ],
    });
  });
};

export default makeConfirmAlert;
