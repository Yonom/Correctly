const validLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÜÖabcdefghijklmnopqrstuvwxyzäüöß -';

/**
 * @param name wird erwartet und auf die erlaubten Zeichen überprüft.
 * @returns False falls ein nicht erlaubtes Zeichen auftritt.
 * @returns False falls der Name über 64 Zeichen hat.
 */
export const isValidName = function isValidName(name) {
  if (name.length > 64) {
    return false;
  }
  for (let i = 0; i < name.length; i++) {
    if (validLetters.indexOf(name.charAt(i)) < 0) {
      return false;
    }
  }
  return true;
};
