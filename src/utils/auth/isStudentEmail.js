import { isValidEmail } from './isValidEmail';

const studentEndings = [
  'fs-students.de',
];

/**
 * @param {string} email The email.
 * @returns {boolean} True, if the email belongs to a student, otherwise false.
 */
export const isStudentEmail = (email) => {
  if (!isValidEmail(email)) return false;
  const emailEnding = email.slice(email.search('@') + 1, email.length).toLowerCase();
  return studentEndings.indexOf(emailEnding, 0) !== -1;
};
