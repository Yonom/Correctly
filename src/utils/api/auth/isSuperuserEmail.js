/**
 *
 * Date created: 16.05.2020
 * Author: Malte Blank
 *
 * Functionality: Checks if the current user is a superuser
 */

import { loadSuperusers } from '../loadConfig';

/**
 * Checks the config file whether the email is registered as superuser
 *
 * @param {string} email The corresponding email.
 * @returns {boolean} True if the user is a superuser, false if not
 */
export function isSuperuserEmail(email) {
  const superusers = loadSuperusers().split(/\r?\n/);
  return superusers.includes(email);
}
