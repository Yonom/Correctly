import { STUDENT, LECTURER, SUPERUSER } from './role';

export const getRoleLabel = (role) => {
  switch (role) {
    case STUDENT:
      return 'Studierender';
    case LECTURER:
      return 'Lehrender';
    case SUPERUSER:
      return 'Superuser';
    default:
      return 'Unbekannte Rolle';
  }
};
