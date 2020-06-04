import { isStudentEmail } from '../../auth/isStudentEmail';
import { isEmployeeEmail } from '../../auth/isEmployeeEmail';

export const STUDENT = 'STUDENT';
export const EMPLOYEE = 'EMPLOYEE';

export const getRole = (email) => {
  if (isStudentEmail(email)) return STUDENT;
  if (isEmployeeEmail(email)) return EMPLOYEE;
  return null;
};
