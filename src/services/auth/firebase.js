import firebase from '../firebase/index';

const auth = firebase.auth();

/**
 * Logs in as the user.
 * @param {String} email
 * @param {String} password
 */
export const login = async (email, password) => {
  throw new Error('not implemented.');
};

/**
 * Registers the user with the given password.
 * Calls /api/auth/firebase/register to save the firstName, lastName, student id in the database.
 * Sends out a verification email.
 *
 * @param {String} email
 * @param {String} password
 * @param {String} firstName
 * @param {String} lastName
 * @param {String} studentId
 */
export const register = async (email, password, firstName, lastName, studentId) => {
  throw new Error('not implemented.');
};

/**
 * Sends a verification email.
 */
export const sendVerificationEmail = async () => {
  throw new Error('not implemented.');
};


/**
 * Sends a password reset email.
 *
 * @param {String} email
 */
export const sendPasswordResetEmail = async (email) => {
  throw new Error('not implemented.');
};

/**
 * Confirms an email.
 *
 * @param {String} code The action code from email.
 */
export const confirmEmail = async (code) => {
  throw new Error('not implemented.');
};

/**
 * Confirms a password reset email.
 *
 * @param {String} code The action code from email.
 * @param {String} newPassword
 */
export const confirmPasswordReset = async (code, newPassword) => {
  throw new Error('not implemented.');
};
