export const STUDENT = 'STUDENT';
export const LECTURER = 'LECTURER';
export const SUPERUSER = 'SUPERUSER';

export const isStudent = (role) => {
  return role === STUDENT;
};

export const isLecturer = (role) => {
  return role === SUPERUSER || role === LECTURER;
};

export const isSuperuser = (role) => {
  return role === SUPERUSER;
};
