import fetchPost from '../../utils/fetchPost';
import APIError from '../../utils/APIError';

/**
 * Logs in as the user.
 *
 * @param {string} email The email.
 * @param {string} password The password.
 */
export const login = async (email, password) => {
  await fetchPost('/api/auth/csv/login', { email, password });
};
