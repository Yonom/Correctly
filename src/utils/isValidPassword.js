import APIError from './APIError';

/**
 * @param {string} password The password to verify.
 * @returns {boolean} True, if the password matches minimum password requirements, otherwise false.
 */
export const isValidPassword = (password) => {
  if (typeof password !== 'string') return false;
  // Minimum eight characters maximum 20
  if (password.length > 20 || password.length < 8) return false;

  // At least one uppercase letter, one lowercase letter and one number
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;

  return true;
};

export const verifyPassword = (password) => {
  if (!verifyPassword(password)) throw new APIError({ code: 'auth/weak-password' });
};
