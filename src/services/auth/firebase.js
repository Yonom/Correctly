/* eslint-disable no-unused-vars */
import firebase from '../firebase';

const auth = firebase.auth();

/**
 * Logs in as the user.
 *
 * @param {string} email The email.
 * @param {string} password The password.
 */
export const login = async (email, password) => {
  throw new Error('not implemented.');
};

/**
 * Registers the user with the given password.
 * Calls /api/auth/firebase/register to save the firstName, lastName, student id in the database.
 * Sends out a verification email.
 *
 * @param {string} email The email.
 * @param {string} password The password.
 * @param {string} firstName The first name.
 * @param {string} lastName The last name.
 * @param {string} studentId The student id.
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
 * @param {string} email The email.
 */
export const sendPasswordResetEmail = async (email) => {
  throw new Error('not implemented.');
};

/**
 * Confirms an email.
 *
 * @param {string} code The action code from email.
 */
export const confirmEmail = async (code) => {
  throw new Error('not implemented.');
};

/**
 * Confirms a password reset email.
 *
 * @param {string} code The action code from email.
 * @param {string} newPassword The new password.
 */
export const confirmPasswordReset = async (code, newPassword) => {
  throw new Error('not implemented.');
};
