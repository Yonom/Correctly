import { makeAlert } from "../components/GlobalNotifications";

export const errorCodes = {
  'auth/email-already-in-use': { // 'Thrown if there already exists an account with the given email address'
    header: '',
    message: '',
  },
  'auth/expired-action-code': { // 'Thrown if the action code has expired'
    header: '',
    message: '',
  },
  'auth/invalid-action-code': { // 'Thrown if the action code is invalid. This can happen if the code is malformed or has already been used'
    header: '',
    message: '',
  },
  'auth/invalid-email': { // 'Thrown if the email address is not valid'
    header: '',
    message: '',
  },
  'auth/user-disabled': { // 'Thrown if the user corresponding to the given action code has been disabled'
    header: '',
    message: '',
  },
  'auth/user-not-found': { // 'Thrown if the user is not found'
    header: '',
    message: '',
  },
  'auth/invalid-name': { // 'Thrown if the provided name is not valid.
    header: '',
    message: '',
  },
  'auth/weak-password': { // 'Thrown if the new password is not strong enough',
    header: '',
    message: '',
  },
  'auth/wrong-password': { // 'Thrown if the password is invalid for the given email',
    header: '',
    message: '',
  },
  'auth/invalid-student-id': { // 'Thrown if the student id is not valid.'
    header: '',
    message: '',
  },
  'auth/csv-not-enabled': { // 'Thrown if the CSV authentication is not enabled in the server.'
    header: '',
    message: '',
  },
  'auth/firebase-not-enabled': { // 'Thrown if the Firebase authentication is not enabled in the server.'
    header: '',
    message: '',
  },
  'auth/invalid-credential': { // 'Thrown if the credential is malformed or has expired.',
    header: '',
    message: '',
  },
  'auth/not-verified': { // 'Thrown if the user has not verified their email yet. A new verification email has been sent.'
    header: '',
    message: '',
  },
  'auth/not-verified': { // 'Thrown if the user has not verified their email yet. A new verification email has been sent.'
    header: '',
    message: '',
  },
  500: { // 'Thrown if an internal server error occured.'
    header: '',
    message: '',
  }
  // 'auth/not-registered' automatically handled
};

export const defaultError = { // 'Thrown if the error code is unknown.'
  header: '',
  message: '',
};

export const getFirebaseErrorMessageFromCode = (code) => {
  return errorCodes[code] || defaultError;
};

export const makeAPIErrorAlert = (apiError) => {
  return makeAlert(apiError.code);
}
