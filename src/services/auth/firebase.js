import { firebaseAuth } from '../firebase';
import fetchPost from '../../utils/fetchPost';

/**
 * Logs in as the user.
 *
 * @param {string} email The email.
 * @param {string} password The password.
 */
export const login = async (email, password) => {
  const { user } = await firebaseAuth.signInWithEmailAndPassword(email, password);

  if (user.emailVerified) {
    const token = await user.getIdToken();
    const response = await fetchPost('/api/auth/firebase/login', { token });

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
 * Calls /api/firebaseAuth/firebase/register to save the firstName, lastName, student id in the database.
 * Sends out a verification email.
 *
 * @param {string} email The email.
 * @param {string} password The password.
 * @param {string} firstName The first name.
 * @param {string} lastName The last name.
 * @param {string} studentId The student id.
 */
export const register = async (email, password, firstName, lastName, studentId) => {
  const { user } = await firebaseAuth.createUserWithEmailAndPassword(email, password);
  try {
    const token = await user.getIdToken();
    const response = await fetchPost('/api/auth/firebase/register', { token, firstName, lastName, studentId });
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
  await firebaseAuth.sendPasswordResetEmail(email);
};

/**
 * Confirms an email.
 *
 * @param {string} code The action code from email.
 */
export const confirmEmail = async (code) => {
  await firebaseAuth.applyActionCode(code);
};

/**
 * Confirms a password reset email.
 *
 * @param {string} code The action code from email.
 * @param {string} newPassword The new password.
 */
export const confirmPasswordReset = async (code, newPassword) => {
  await firebaseAuth.confirmPasswordReset(code, newPassword);
};
