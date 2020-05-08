import { APIError } from '../fetchPost';

const validLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÜÖabcdefghijklmnopqrstuvwxyzäüöß -';

/**
 * @param {string} name wird erwartet und auf die erlaubten Zeichen überprüft.
 * @returns {boolean} false falls ein nicht erlaubtes Zeichen auftritt. false falls der Name über 64 Zeichen hat. Sonst true
 */
export const isValidName = function isValidName(name) {
  if (typeof name !== 'string') return false;
  if (name.length > 64 || name.length < 1) {
    return false;
  }
  for (let i = 0; i < name.length; i++) {
    if (validLetters.indexOf(name.charAt(i)) < 0) {
      return false;
    }
  }
  return true;
};

export const verifyName = (name) => {
  if (!isValidName(name)) throw new APIError({ code: 'auth/invalid-name' });
};
