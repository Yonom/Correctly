/**
 *
 * Date created: 16.05.2020
 * Author: Malte Blank
 *
 * Functionality: Checks if the current user is a superuser
 */

const fs = require('fs');

// TODO: put filepath to config file in const file
const file = '.keys/superuser.txt';

/**
 * Checks the config file whether the email is registered as superuser
 *
 * @param {string} email The corresponding email.
 * @returns {boolean} True if the user is a superuser, false if not
 */
export function isSuperuser(email) {
  const superusers = fs.readFileSync(file, 'utf8').toString().split('\n');
  return superusers.includes(email);
}
