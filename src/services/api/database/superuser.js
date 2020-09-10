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
 */
export function deactivateUserAsSuperuser(userId) {
  // columns of table 'user': userId, email, firstName, lastName, studentId, isEmailVerified, isactive
  const queryText = 'UPDATE users SET isactive = FALSE WHERE userId = $1';
  const params = [userId];
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
 */
export function updateUserAsSuperuser(userId, firstName, lastName, email, studentId) {
  // columns of table 'user': userId, email, firstName, lastName, studentId, isEmailVerified, isactive
  const queryText = 'UPDATE users SET email = $2, firstName = $3, lastName = $4, studentId = $5 WHERE userId = $1';
  const params = [userId, email, firstName, lastName, studentId];
  return databaseQuery(queryText, params);
}
