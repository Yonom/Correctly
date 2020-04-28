import fetchPost from '../../utils/fetchPost';

/**
 * Logs in as the user.
 *
 * @param {string} email The email.
 * @param {string} password The password.
 */
export const login = async (email, password) => {
  const response = await fetchPost('/api/auth/csv/login', { email, password });

  if (response.status !== 200) {
    throw new Error(await response.json());
  }
};
