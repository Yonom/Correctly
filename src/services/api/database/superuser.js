/**
 *
 * Date created: 16.05.2020
 * Author: Malte Blank
 *
 * Functionality: Executes Superuser functionalities (delete users, change personal data of users, assign new roles to users or withdraw them)
 */

import { databaseQuery } from '.';

/**
 * Deactivates a user (both lecturer and student) from the 'users' table of the database.
 *
 * @param {string} userId The corresponding user Id (ger. 'Benutzerkennung'). Cannot be empty.
 * @returns {Promise<import('pg').QueryResult<any>>} The query result.
 */
export function deactivateUserAsSuperuser(userId) {
  // columns of table 'user': userId, email, firstName, lastName, studentId, isEmailVerified, isactive
  const queryText = 'UPDATE users SET isactive = FALSE, email = NULL WHERE userId = $1';
  const params = [userId];
  return databaseQuery(queryText, params);
}

/**
 * Changes a student's or lecturer's email adress from the 'users' table of the database.
 *
 * @param {string} userId The corresponding user Id (ger. 'Benutzerkennung'). Cannot be empty.
 * @param {string} email The corresponding mail address (ger. 'E-Mail Adresse'). Cannot be empty.
 * @returns {Promise<import('pg').QueryResult<any>>} The query result.
 */
export function updateEmailAsSuperuser(userId, email) {
  // columns of table 'user': userId, email, firstName, lastName, studentId, isEmailVerified, isactive
  const queryText = 'UPDATE users SET email = $2, isEmailVerified = FALSE WHERE userId = $1';
  const params = [userId, email];
  return databaseQuery(queryText, params);
}

/**
 * Changes a student's or lecturer's name and sir name from the 'users' table of the database.
 *
 * @param {string} userId The corresponding user Id (ger. 'Benutzerkennung'). Cannot be empty.
 * @param {string} firstName The first name(s) of the user (ger. 'Vorname(n)'). Cannot be empty.
 * @param {string} lastName The sir name of the user (ger. 'Nachname'). Cannot be empty.
 * @returns {Promise<import('pg').QueryResult<any>>} The query result.
 */
export function updateNameAsSuperuser(userId, firstName, lastName) {
  // columns of table 'user': userId, email, firstName, lastName, studentId, isEmailVerified, isactive
  const queryText = 'UPDATE users SET firstName = $2, lastName = $3 WHERE userId = $1';
  const params = [userId, firstName, lastName];
  return databaseQuery(queryText, params);
}

/**
 * Changes a student's student ID from the 'users' table of the database.
 *
 * @param {string} userId The corresponding user Id (ger. 'Benutzerkennung'). Cannot be empty.
 * @param {string} studentId The student Id of the user (ger. 'Matrikelnummer').
 * @returns {Promise<import('pg').QueryResult<any>>} The query result.
 */
export function updateStudentIdAsSuperuser(userId, studentId) {
  // columns of table 'user': userId, email, firstName, lastName, studentId, isEmailVerified, isactive
  const queryText = 'UPDATE users SET studentId = $2 WHERE userId = $1';
  const params = [userId, studentId];
  return databaseQuery(queryText, params);
}

/**
 * Changes a student's student ID from the 'users' table of the database.
 *
 * @param {string} userId The corresponding user Id (ger. 'Benutzerkennung'). Cannot be empty.
 * @param {string} email The corresponding mail address (ger. 'E-Mail Adresse'). Cannot be empty.
 * @param {string} firstName The first name(s) of the user (ger. 'Vorname(n)'). Cannot be empty.
 * @param {string} lastName The sir name of the user (ger. 'Nachname'). Cannot be empty.
 * @param {string} studentId The student Id of the user (ger. 'Matrikelnummer').
 * @param {boolean} verified Whether the user is verified or not (ger. 'Verifikationsstatus'). Cannot be empty.
 * @returns {Promise<import('pg').QueryResult<any>>} The query result.
 */
export function updateUserAsSuperuser(userId, email, firstName = null, lastName = null, studentId = null, verified = false) {
  // columns of table 'user': userId, email, firstName, lastName, studentId, isEmailVerified, isactive
  const queryText = 'UPDATE users SET email = $2, firstName = $3, lastName = $4, studentId = $5, verified = $6 WHERE userId = $1';
  const params = [userId, email, firstName, lastName, studentId, verified];
  return databaseQuery(queryText, params);
}

/**
 * Returns all active users
 *
 * @returns {Promise<import('pg').QueryResult<any>>} The users
 */
export const selectAllUsersAsSuperuser = async () => {
  const queryText = 'SELECT * FROM users where isactive = $1;';
  const params = [true];
  const result = await databaseQuery(queryText, params);
  return result.rows;
};
