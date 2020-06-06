import { isValidEmail } from './isValidEmail';

const studentEndings = [
  'fs.de',
];

/**
 * @param {string} email The email.
 * @returns {boolean} True, if the email belongs to an employee, otherwise false.
 */
export const isEmployeeEmail = (email) => {
  if (!isValidEmail(email)) return false;
  const emailEnding = email.slice(email.search('@') + 1, email.length).toLowerCase();
  return studentEndings.indexOf(emailEnding, 0) !== -1;
};
