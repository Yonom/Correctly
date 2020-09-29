import { STUDENT, LECTURER, SUPERUSER } from './role';

export const getRoleLabel = (role) => {
  switch (role) {
    case STUDENT:
      return 'Student';
    case LECTURER:
      return 'Lecturer';
    case SUPERUSER:
      return 'Superuser';
    default:
      return 'Unknown role';
  }
};
