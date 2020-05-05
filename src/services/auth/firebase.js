import { firebaseAuth } from '../firebase';
import fetchPost, { APIError } from '../../utils/fetchPost';
import { verifyEmail } from '../../utils/isValidEmail';
import { verifyPassword } from '../../utils/isValidPassword';
import { verifyName } from '../../utils/isValidName';
import { verifyStudentId } from '../../utils/isValidStudentId';

/**
 * Logs in as the user.
 *
 * @param {string} email The email.
 * @param {string} password The password.
 */
export const login = async (email, password) => {
  verifyEmail(email);

  const { user } = await firebaseAuth.signInWithEmailAndPassword(email, password);

  if (user.emailVerified) {
    const token = await user.getIdToken();
    await fetchPost('/api/auth/firebase/login', { token });
  } else {
    await user.sendEmailVerification();
    throw new APIError({ code: 'auth/not-verified' });
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
  verifyName(firstName);
  verifyName(lastName);
  verifyEmail(email);
  verifyPassword(password);
  verifyStudentId(email, studentId);

  const { user } = await firebaseAuth.createUserWithEmailAndPassword(email, password);
  const token = await user.getIdToken();
  await fetchPost('/api/auth/firebase/register', { token, firstName, lastName, studentId });
  await user.sendEmailVerification();
};

/**
 * Sends a password reset email.
 *
 * @param {string} email The email.
 */
export const sendPasswordResetEmail = async (email) => {
  verifyEmail(email);

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
  verifyPassword(newPassword);

  await firebaseAuth.confirmPasswordReset(code, newPassword);
};
