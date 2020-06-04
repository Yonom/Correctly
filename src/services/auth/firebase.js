import { firebaseAuth } from '../firebase';
import fetchPost, { APIError } from '../../utils/fetchPost';
import { verifyEmail } from '../../utils/auth/isValidEmail';
import { verifyPassword } from '../../utils/auth/isValidPassword';
import { verifyName } from '../../utils/auth/isValidName';
import { verifyStudentId } from '../../utils/auth/isValidStudentId';

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
 * Calls /api/firebaseAuth/firebase/register to save the firstName, lastName, student id in the database.
 *
 * @param {string} firstName The first name.
 * @param {string} lastName The last name.
 * @param {string} studentId The student id.
 */
export const registerUserData = async (firstName, lastName, studentId) => {
  const user = firebaseAuth.currentUser;
  verifyName(firstName);
  verifyName(lastName);
  verifyStudentId(user.email, studentId);

  const token = await user.getIdToken();
  await fetchPost('/api/auth/firebase/register', { token, firstName, lastName, studentId });
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
  await user.sendEmailVerification();
  await registerUserData(firstName, lastName, studentId);
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
 * Checks an action code from email.
 *
 * @param {string} code The action code from email.
 * @returns {import('firebase').auth.ActionCodeInfo} Metadata about the code.
 */
export const checkCode = async (code) => {
  return await firebaseAuth.checkActionCode(code);
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

/**
 * Gets the currently logged in user.
 *
 * @returns {import('firebase').User} Currently logged in user.
 */
export const getCurrentUser = () => {
  return firebaseAuth.currentUser;
};
