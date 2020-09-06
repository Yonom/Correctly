import { APIError } from '../../fetchPost';

import { isStudentEmail } from '../../auth/isStudentEmail';
import { isEmployeeEmail } from '../../auth/isEmployeeEmail';
import { isSuperuserEmail } from './isSuperuserEmail';
import { STUDENT, EMPLOYEE, SUPERUSER, isStudent, isEmployee, isSuperuser } from '../../auth/role';

export const getRole = (email) => {
  if (isSuperuserEmail(email)) return SUPERUSER;
  if (isEmployeeEmail(email)) return EMPLOYEE;
  if (isStudentEmail(email)) return STUDENT;
  return null;
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
