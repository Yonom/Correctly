import { APIError } from '../../fetchPost';

import { isStudentEmail } from '../../auth/isStudentEmail';
import { isLecturerEmail } from '../../auth/isLecturerEmail';
import { isSuperuserEmail } from './isSuperuserEmail';
import { STUDENT, LECTURER, SUPERUSER, isStudent, isLecturer, isSuperuser } from '../../auth/role';

export const getRole = (email) => {
  if (isSuperuserEmail(email)) return SUPERUSER;
  if (isLecturerEmail(email)) return LECTURER;
  if (isStudentEmail(email)) return STUDENT;
  return null;
};

export const verifyStudent = (role) => {
  if (!isStudent(role)) {
    throw new APIError({ code: 'auth/unauthorized' });
  }
};

export const verifyLecturer = (role) => {
  if (!isLecturer(role)) {
    throw new APIError({ code: 'auth/unauthorized' });
  }
};

export const verifySuperuser = (role) => {
  if (!isSuperuser(role)) {
    throw new APIError({ code: 'auth/unauthorized' });
  }
};
