import { makeAlert } from '../components/GlobalNotifications';

export const errorCodes = {
  500: { // 'Thrown if an internal server error occured.'
    header: 'Internal server error (HTTP status code: 500)',
    message: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
  },
  'auth/csv-not-enabled': { // 'Thrown if the CSV authentication is not enabled in the server.'
    header: 'CSV authentication is not enabled in the server',
    message: 'CSV authentication is not enabled. Please contact the Admin (email Admin).',
  },
  'auth/email-already-in-use': { // 'Thrown if there already exists an account with the given email address'
    header: 'Email address already exists',
    message: 'Your specified email already exists as an account. Please log in with this email address',
  },
  'auth/expired-action-code': { // 'Thrown if the action code has expired'
    header: 'Action code has expired',
    message: 'Your action code has expired.',
  },
  'auth/firebase-not-enabled': { // 'Thrown if the Firebase authentication is not enabled in the server.'
    header: 'Authentication is not enabled',
    message: 'Firebase authentication is not enabled on the server. Please contact the admin (email Admin).',
  },
  'auth/invalid-action-code': { // 'Thrown if the action code is invalid. This can happen if the code is malformed or has already been used'
    header: 'Action code is invalid',
    message: 'Your action code is invalid. This can happen if the code is malformed or has already been used.',
  },
  'auth/invalid-credential': { // 'Thrown if the credential is malformed or has expired.',
    header: 'Credential is malformed or has expired',
    message: 'Your badge is deformed or expired. Please start a new session.',
  },
  'auth/invalid-email': { // 'Thrown if the email address is not valid'
    header: 'Email address is not possible',
    message: 'The email address is not valid. Please use an email address containing @fs.de or @fs-students.de.',
  },
  'auth/invalid-name': { // 'Thrown if the provided name is not valid.',
    header: 'Provided name is not possible',
    message: 'The provided name is not valid. Only Latin letters, "ä, ö, ß" and hyphen are possible',
  },
  'auth/invalid-student-id': { // 'Thrown if the student id is not valid.'
    header: 'Student id is not valid',
    message: 'The provided student id is not valid. Please check your input or contact Helpdesk. The student id is made of 7 digits.',
  },
  // 'auth/not-registered': { // 'Thrown if the registration is incomplete.' --- automatically handled
  'auth/not-verified': { // 'Thrown if the user has not verified their email yet. A new verification email has been sent.'
    header: 'Email not yet verified',
    message: 'To complete the registration process, you need to verify your email adress first. A new verification email has been sent to your inbox. Please follow the instructions outlined in the email.',
  },
  'auth/user-disabled': { // 'Thrown if the user corresponding to the given action code has been disabled.'
    header: 'User was deactivated',
    message: 'The user corresponding to the specified action code has been deactivated. Please contact the Helpdesk (email helpdesk).',
  },
  'auth/user-not-found': { // 'Thrown if the user is not found'
    header: 'User/email is not found',
    message: 'User is not found. The email does not exist in our database. Please check your input and try again or contact the helpdesk (email helpdesk).',
  },
  'auth/weak-password': { // 'Thrown if the new password is not strong enough',
    header: 'The password used to register is not strong enough',
    message: 'The password entered is not strong enough. Hint: To make your password stronger, use upper and lower case letters, numbers, and symbols like ! ” ? $ % ^ & ).',
  },
  'auth/wrong-password': { // 'Thrown if the password is invalid for the given email',
    header: 'Invalid password',
    message: 'The password is invalid for the given email adress. Try again or visit URL to reset your password. ',
  },
};

export const defaultError = { // 'Thrown if the error code is unknown.'
  header: 'Unknown error (HTTP status code: 520)',
  message: 'Request can\'t be fulfilled, because an unidentified error has occured. Please contact the IT Admin (tel.: ; email: ). ',
};

export const getFirebaseErrorMessageFromCode = (code) => {
  return errorCodes[code] || defaultError;
};

export const makeAPIErrorAlert = (apiError) => {
  return makeAlert(getFirebaseErrorMessageFromCode(apiError.code));
};
