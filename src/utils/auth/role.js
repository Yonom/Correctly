export const STUDENT = 'STUDENT';
export const EMPLOYEE = 'EMPLOYEE';
export const SUPERUSER = 'SUPERUSER';

export const isStudent = (role) => {
  return role === STUDENT;
};

export const isEmployee = (role) => {
  return role === SUPERUSER || role === EMPLOYEE;
};

export const isSuperuser = (role) => {
  return role === SUPERUSER;
};
