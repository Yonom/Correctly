/* eslint-disable no-unused-vars */
/**
 * Logs in as the user.
 *
 * @param {string} email The email.
 * @param {string} password The password.
 */
export const login = async (email, password) => {
  const response = await fetch('/api/csv/login', {
    method: 'POST',
    body: { email, password },
  });

  if (response.status !== 200) {
    throw new Error(await response.json());
  }
};
