export const getRoleLabel = (role) => {
  switch (role) {
    case 'STUDENT':
      return 'Studierender';
    case 'EMPLOYEE':
      return 'Lehrender';
    case 'SUPERUSER':
      return 'Superuser';
    default:
      return 'Unbekannte Rolle';
  }
};