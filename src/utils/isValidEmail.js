import { validate } from 'email-validator';

const validEndings = [
  'fs-students.de',
  'fs.de',
];

/**
 * @param email wird erwartet und mit der Liste der validen E-Mail Endungen verglichen,
 * falls die Endung dort auftaucht, wird true zurückgegeben, sonst false.
 * Auch wenn die Email aus sonstigen Gründen keine valide Syntax aufweist, wird false zurückgegeben
 */
export const isValidEmail = function isValidEmail(email) {
  if (!validate(email)) {
    return false;
  }
  const emailEnding = email.slice(email.search('@') + 1, email.length);
  if (validEndings.indexOf(emailEnding, 0) !== -1) {
    return true;
  }
  return false;
};
