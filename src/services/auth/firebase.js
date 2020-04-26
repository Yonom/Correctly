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
  const { user } = await auth.signInWithEmailAndPassword(email, password);

  if (user.emailVerified) {
    const token = await user.getIdToken();
    const response = await fetch('/api/firebase/login', {
      method: 'POST',
      body: { token },
    });

    if (response.status !== 200) {
      throw new Error(await response.json());
    }
  } else {
    await user.sendEmailVerification();
    throw new Error('E-Mail is not yet verified.');
  }
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
  const { user } = await auth.createUserWithEmailAndPassword(email, password);
  try {
    const token = await user.getIdToken();
    const response = await fetch('/api/firebase/register', {
      method: 'POST',
      body: {
        token, firstName, lastName, studentId,
      },
    });
    if (response.status !== 200) {
      throw new Error(await response.json());
    }
  } catch (e) {
    await user.delete();
    throw e;
  }
  await user.sendEmailVerification();
};

/**
 * Sends a password reset email.
 *
 * @param {string} email The email.
 */
export const sendPasswordResetEmail = async (email) => {
  await auth.sendPasswordResetEmail(email);
};

/**
 * Confirms an email.
 *
 * @param {string} code The action code from email.
 */
export const confirmEmail = async (code) => {
  await auth.confirmEmail(code);
};

/**
 * Confirms a password reset email.
 *
 * @param {string} code The action code from email.
 * @param {string} newPassword The new password.
 */
export const confirmPasswordReset = async (code, newPassword) => {
  await auth.confirmPasswordReset(code, newPassword);
};
