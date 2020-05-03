import { validate } from 'email-validator';

const validEndings = [
  'fs-students.de',
  'fs.de',
];

/**
 * @param {string} email wird erwartet und mit der Liste der validen E-Mail Endungen verglichen.
 * @returns {boolean} True falls die Endung dort auftaucht, sonst returns false. false auch wenn die Email über 64 Zeichen lang ist oder aus sonstigen Gründen keine valide Syntax aufweist.
 */
export const isValidEmail = function isValidEmail(email) {
  if (email.length > 64) {
    return false;
  }
  if (!validate(email)) {
    return false;
  }
  const emailEnding = email.slice(email.search('@') + 1, email.length);
  if (validEndings.indexOf(emailEnding, 0) !== -1) {
    return true;
  }
  return false;
};
