import { isValidEmail } from './isValidEmail';

/**
 * @param {string} email The email.
 * @param {number|null} studentId The student id.
 * @returns {boolean} True, if the student id is valid, otherwise false.
 */
export const isValidStudentId = (email, studentId) => {
  if (isValidEmail(email)) {
    return studentId === null;
  }

  if (typeof studentId !== 'number') return false;
  return studentId >= 1000000 && studentId < 10000000;
};
