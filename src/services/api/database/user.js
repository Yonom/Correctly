/**
 *
 * Date created: 25.04.2020
 * Author: Robin Rinn
 *
 * Functionality: Receives authentification from user and
 * updates user data in the database
 */

import { databaseQuery } from '.';

/**
 * Inserts a new user into the 'users' table of the database.
 *
 * @param {string} userId The corresponding user Id (ger. 'Benutzerkennung'). Cannot be empty.
 * @param {string} email The corresponding mail address (ger. 'E-Mail Adresse'). Cannot be empty.
 * @param {string} firstName The first name(s) of the user (ger. 'Vorname(n)'). Cannot be empty.
 * @param {string} lastName The sir name of the user (ger. 'Nachname'). Cannot be empty.
 * @param {string} studentId The student Id of the user (ger. 'Matrikelnummer').
 * @param {boolean} verified Whether the user is verified or not (ger. 'Verifikationsstatus'). Cannot be empty.
 */
export function insertUser(userId, email, firstName = null, lastName = null, studentId = null, verified = false) {
  // columns of table 'user': userId, email, firstName, lastName, studentId, isEmailVerified
    const queryText = 'INSERT INTO users(userId, email, firstName, lastName, studentId, isEmailVerified) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    const params = [userId, email, firstName, lastName, studentId, verified];
    databaseQuery(queryText, params);
}

/**
 * Updates an existing user in the 'users' table of the database.
 * @param {string} userId The corresponding user Id (ger. 'Benutzerkennung'). Cannot be empty.
 * @param {string} email The corresponding mail address (ger. 'E-Mail Adresse'). Cannot be empty.
 * @param {string} firstName The first name(s) of the user (ger. 'Vorname(n)'). Cannot be empty.
 * @param {string} lastName The sir name of the user (ger. 'Nachname'). Cannot be empty.
 * @param {string} studentId The student Id of the user (ger. 'Matrikelnummer').
 * @param {boolean} verified Whether the user is verified or not (ger. 'Verifikationsstatus'). Cannot be empty.
 */


 function updateUser(userId, email, firstName = null, lastName = null, studentId = null, verified = false) {
  // columns of table 'user': userId, email, firstName, lastName, studentId, isEmailVerified
  const queryText = 'UPDATE users Set email = $2, firstName = $3, lastName = $4, studentId = $5, isEmailVerified = $6 WHERE userId = $1';
  const params = [userId, email, firstName, lastName, studentId, verified];
  databaseQuery(queryText, params);
}

/**
 * Updates just the mail and verified fields for a user in
 * the 'users' table of the database.
 * 
 * @param {string} userId The corresponding user Id (ger. 'Benutzerkennung'). Cannot be empty.
 * @param {string} email The corresponding mail address (ger. 'E-Mail Adresse'). Cannot be empty.
 * @param {boolean} verified Whether the user is verified or not (ger. 'Verifikationsstatus'). Cannot be empty.
 * 
 */
function updateMailAndVerified(userId, email, verified) {
  // columns of table 'user': userId, email, firstName, lastName, studentId, isEmailVerified
  const queryText = 'UPDATE users Set email = $2, isEmailVerified = $3 WHERE userId = $1';
  const params = [userId, email, verified];
  databaseQuery(queryText, params);
}

/**
 * Updates an existing user or inserts a new user if the primary key
 * 'userId' cannot be found at the 'users' table of the database.
 * @param {string} userId The corresponding user Id (ger. 'Benutzerkennung'). Cannot be empty.
 * @param {string} email The corresponding mail address (ger. 'E-Mail Adresse'). Cannot be empty.
 * @param {string} firstName The first name(s) of the user (ger. 'Vorname(n)'). Cannot be empty.
 * @param {string} lastName The sir name of the user (ger. 'Nachname'). Cannot be empty.
 * @param {string} studentId The student Id of the user (ger. 'Matrikelnummer').
 * @param {boolean} verified Whether the user is verified or not (ger. 'Verifikationsstatus'). Cannot be empty.
 */
export function upsertUser(userId, email, firstName = null, lastName = null, studentId = null, verified = false) {
  // columns of table 'user': userId, email, firstName, lastName, studentId, isEmailVerified
    const queryText = 'UPSERT INTO users(userId, email, firstName, lastName, studentId, isEmailVerified) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    const params = [userId, email, firstName, lastName, studentId, verified];
    databaseQuery(queryText, params);
}