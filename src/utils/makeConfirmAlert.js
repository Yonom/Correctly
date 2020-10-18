import { makeAlert } from '../components/GlobalNotifications';

const makeConfirmAlert = () => {
  return new Promise((resolve, reject) => {
    makeAlert({
      header: 'Are you sure?',
      message: 'Once you submit, it is not possible to edit your submission.',
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
