export const errorCodes = {
  'auth/email-already-in-use': 'Thrown if there already exists an account with the given email address',
  'auth/expired-action-code': 'Thrown if the action code has expired',
  'auth/invalid-action-code': 'Thrown if the action code is invalid. This can happen if the code is malformed or has already been used',
  'auth/invalid-email': 'Thrown if the email address is not valid',
  'auth/user-disabled': 'Thrown if the user corresponding to the given action code has been disabled',
  'auth/user-not-found': 'Thrown if the user is not found',
  'auth/weak-password': 'Thrown if the new password is not strong enough',
  'auth/wrong-password': 'Thrown if the password is invalid for the given email',
};

export const getFirebaseErrorMessageFromCode = (code) => {
  return errorCodes[code] || 'Unexpected error';
};
