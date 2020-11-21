import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { makeAlert } from '../components/GlobalNotifications';

const errorCodes = {
  500: { // 'Thrown if an internal server error occured.'
    header: 'Internal server error (HTTP status code: 500)',
    message: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
  },
  413: { // 'Thrown if the upload file size is too large.'
    header: 'Upload too large',
    message: 'We are unable to process your request because the upload is too large',
  },
  'auth/csv-not-enabled': { // 'Thrown if the CSV authentication is not enabled in the server.'
    header: 'CSV authentication is not enabled in the server',
    message: 'CSV authentication is not enabled. Please contact support.',
  },
  'auth/email-already-in-use': { // 'Thrown if there already exists an account with the given email address'
    header: 'Email address already exists',
    message: 'Your specified email already exists as an account. Please log in with this e-mail address.',
  },
  'auth/expired-action-code': { // 'Thrown if the action code has expired'
    header: 'Action code has expired',
    message: 'Your action code has expired.',
  },
  'auth/firebase-not-enabled': { // 'Thrown if the Firebase authentication is not enabled in the server.'
    header: 'Authentication is not enabled',
    message: 'Firebase authentication is not enabled on the server. Please contact support.',
  },
  'auth/invalid-action-code': { // 'Thrown if the action code is invalid. This can happen if the code is malformed or has already been used'
    header: 'Action code is invalid',
    message: 'Your action code is invalid. This can happen if the code is incorrect or has already been used.',
  },
  'auth/invalid-credential': { // 'Thrown if the credential is malformed or has expired.',
    header: 'Credential is malformed or has expired',
    message: 'Your credentials are malformed or expired. Please start a new session.',
  },
  'auth/invalid-email': { // 'Thrown if the email address is not valid'
    header: 'Email address is not valid',
    message: 'The e-mail address is not valid. Please use an e-mail address that contains @fs.de or @fs-students.de.',
  },
  'auth/invalid-name': { // 'Thrown if the provided name is not valid.',
    header: 'The provided name is not valid',
    message: 'The specified name is not valid. Only Latin letters, "ä, ö, ü, ß" and hyphen are possible.',
  },
  'auth/invalid-student-id': { // 'Thrown if the student id is not valid.'
    header: 'Student ID is not valid',
    message: 'Student ID is not valid. The given student ID is not valid. Please check your entry or contact the helpdesk. The student ID consists of 7 digits.',
  },
  'auth/unauthorized': { // 'Thrown if user does not have permission to perform their action.'
    header: 'Unauthorized',
    message: 'You do not have permission to perform this action.',
  },
  // 'auth/invalid-user-id'
  'auth/login-expired': { // 'Thrown if login has expired.'
    header: 'Login expired',
    message: 'Your login expired, please sign in again.',
  },
  'auth/not-logged-in': { // 'Thrown if user not logged in.'
    header: 'Login required',
    message: 'This page is only visible to logged-in users.',
  },
  // 'auth/not-registered' 'Thrown if the registration is incomplete.' --- automatically handled
  'auth/not-verified': { // 'Thrown if the user has not verified their email yet. A new verification email has been sent.'
    header: 'Email address not yet verified',
    message: 'To complete the registration process, you must first confirm your email address. A new confirmation email has been sent to your inbox. Please follow the instructions in the email.',
  },
  'auth/user-disabled': { // 'Thrown if the user corresponding to the given action code has been disabled.'
    header: 'User has been disabled',
    message: 'The user corresponding to the specified action code has been disabled. Please contact support.',
  },
  'auth/user-not-found': { // 'Thrown if the user is not found'
    header: 'User/E-Mail address not found',
    message: 'User not found. The email does not exist in our database. Please check your input and try again or contact support.',
  },
  'auth/weak-password': { // 'Thrown if the new password is not strong enough',
    header: 'The password used for registration is not strong enough',
    message: 'The entered password is not strong enough. Tip: To make your password stronger, use upper and lower case letters, numbers and symbols like ! ” ? $ % ^ & ).',
  },
  'auth/wrong-password': { // 'Thrown if the password is invalid for the given email',
    header: 'Invalid password',
    message: 'The password is invalid for the specified e-mail address. Please try again or reset your password.',
  },
  'courses/updating-not-allowed': {
    header: 'Restricted Acces',
    message: 'You are not allowed to change that course.',
  },
  'user/not-found': { // 'Thrown if the user is not found.'
    header: 'User not found',
    message: 'The specified user could not be found.',
  },
  'course/not-found': { // 'Thrown if the course is not found.'
    header: 'Course not found',
    message: 'The specified course could not be found.',
  },
  'upload/max-limit': { // 'Thrown if the file is too big.'
    header: 'File size too large!',
    message: 'Files cannot be larger than 50 MB.',
  },
  'upload/max-name-limit': { // 'Thrown if the file name is too big.'
    header: 'File name is too long!',
    message: 'File names cannot be longer than 500 characters.',
  },
  'solution/no-allowed-formats': { // 'Thrown if solution upload failed.'
    header: 'The submission of the solution has a problem',
    message: 'Perhaps you have already submitted a solution?',
  },
  'upload/bad-file-format': { // 'Thrown if the file extension is not allowed.'
    header: 'File format not allowed',
    message: 'The provided file format violates the constraints set by your lecturer.',
  },
  'homework/not-found': { // 'Thrown if the homework id is not found.'
    header: 'Homework not found',
    message: 'The requested homework id has not been found.',
  },
  'homework/not-available': { // 'Thrown if the homework is not available yet.'
    header: 'Homework not available',
    message: 'This homework is not available yet.',
  },
  'plagiarism/no-homework-id': { // 'Thrown if the homework is not available yet.'
    header: 'No Homework ID',
    message: 'No Homework ID has been provided.',
  },
  'plagiarism/unkonwn-audit-mode': { // 'Thrown if the audit mode of the database is unknown.'
    header: 'Unknown audit mode',
    message: 'The given audit mode is not known.',
  },
  'solution/not-found': { // 'Thrown if the solution is not found.'
    header: 'Solution not found',
    message: 'The requested solution has not been found.',
  },
  'audit/not-found': { // 'Thrown if an audit is not found.'
    header: 'Audit not found',
    message: 'The requested audit has not been found.',
  },
};

const formError = ({ type }) => {
  switch (type) {
    case 'required':
      return 'Not all mandatory inputs were filled out.';
    default:
      return 'Invalid input in one of the fields.';
  }
};

const getDefaultError = (code) => ({ // 'Thrown if the error code is unknown.'
  header: 'Unknown error',
  message: `Request cannot be met because an unidentified error has occurred (${code}). Please contact support.`,
});

const getErrorMessageFromSubmitErrors = (errors) => {
  return [...new Set(Object.values(errors).map(formError))].join('<br />');
};

export const onSubmitError = (errors) => {
  makeAlert({
    header: 'Form error',
    message: getErrorMessageFromSubmitErrors(errors),
  });
};

const getErrorMessageFromCode = (code) => {
  return errorCodes[code] || getDefaultError(code);
};

export const makeAPIErrorAlert = (apiError) => {
  return makeAlert(getErrorMessageFromCode(apiError.code));
};

const noPermErrorCodes = ['auth/unauthorized', 'auth/not-logged-in', 'auth/login-expired'];

export const useOnErrorAlert = ({ data, error, isValidating }) => {
  const router = useRouter();
  const [errorShown, setErrorShown] = useState();

  useEffect(() => {
    if (error && !errorShown && isValidating) {
      setErrorShown(true);
      makeAPIErrorAlert(error);

      if (noPermErrorCodes.includes(error.code)) {
        router.push('/');
      }
    }
  }, [router, error, errorShown, isValidating]);

  return { data, error, isValidating };
};
