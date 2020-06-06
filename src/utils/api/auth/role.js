import { isStudentEmail } from '../../auth/isStudentEmail';
import { isEmployeeEmail } from '../../auth/isEmployeeEmail';
import { isSuperuserEmail } from '../../auth/isSuperuserEmail';
import { APIError } from '../../fetchPost';

const STUDENT = 'STUDENT';
const EMPLOYEE = 'EMPLOYEE';
const SUPERUSER = 'SUPERUSER';

export const getRole = (email) => {
  if (isSuperuserEmail(email)) return SUPERUSER;
  if (isEmployeeEmail(email)) return EMPLOYEE;
  if (isStudentEmail(email)) return STUDENT;
  return null;
};

export const isStudent = (role) => {
  return role === STUDENT;
};

export const isEmployee = (role) => {
  return role === SUPERUSER || role === EMPLOYEE;
};

export const isSuperuser = (role) => {
  return role === SUPERUSER;
};

export const verifyStudent = (role) => {
  if (!isStudent(role)) {
    throw new APIError({ code: 'auth/unauthorized' });
  }
};

export const verifyEmployee = (role) => {
  if (!isEmployee(role)) {
    throw new APIError({ code: 'auth/unauthorized' });
  }
};

export const verifySuperuser = (role) => {
  if (!isSuperuser(role)) {
    throw new APIError({ code: 'auth/unauthorized' });
  }
};
