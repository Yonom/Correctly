import { isStudentEmail } from './isStudentEmail';
import { APIError } from '../fetchPost';

/**
 * @param {string} email The email.
 * @param {number|null} studentId The student id.
 * @returns {boolean} True, if the student id is valid, otherwise false.
 */
const isValidStudentId = (email, studentId) => {
  if (!isStudentEmail(email)) {
    return studentId == null;
  }

  if (typeof studentId !== 'number') return false;
  return studentId >= 1000000 && studentId < 10000000;
};

export const verifyStudentId = (email, studentId) => {
  if (!isValidStudentId(email, studentId)) throw new APIError({ code: 'auth/invalid-student-id' });
};
