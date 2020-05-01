const validLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÜÖabcdefghijklmnopqrstuvwxyzäüöß ';

/**
 * @param name wird erwartet und auf die erlaubten Zeichen überprüft,
 * falls ein nicht erlaubtes Zeichen auftritt, wird false zurückgegeben, sonst true.
 * Ein leerer String wird ebenfalls akzeptiert.
 */
const isValidName = function isValidName(name) {
  for (let i = 0; i < name.length; i++) {
    if (validLetters.indexOf(name.charAt(i)) < 0) {
      return false;
    }
  }
  return true;
};
exports.isValidName = isValidName;
