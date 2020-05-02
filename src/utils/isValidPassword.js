/**
 * 
 * @param {string} password The password to verify.
 * @returns {boolean} True, if the password matches minimum password requirements, otherwise false.
 */
export const isValidPassword = (password) => {
  // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
  // https://stackoverflow.com/a/21456918/1778374
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/.test(password);
};
