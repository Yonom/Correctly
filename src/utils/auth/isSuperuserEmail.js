/**
 *
 * Date created: 16.05.2020
 * Author: Malte Blank
 *
 * Functionality: Checks if the current user is a superuser
 */

import fs from 'fs';

// TODO: put filepath to config file in const file
const file = '.keys/superuser.txt';

if (false) require('.keys/superuser.txt');
/**
 * Checks the config file whether the email is registered as superuser
 *
 * @param {string} email The corresponding email.
 * @returns {boolean} True if the user is a superuser, false if not
 */
export function isSuperuserEmail(email) {
  const superusers = fs.readFileSync(file, 'utf8').toString().split(/\r?\n/);
  return superusers.includes(email);
}
