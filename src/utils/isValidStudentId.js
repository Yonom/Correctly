export const isValidStudentId = (studentId) => {
  if (typeof studentId !== 'number') return false;
  return studentId >= 1000000 && studentId < 10000000;
};
