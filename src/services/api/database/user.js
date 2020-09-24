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
  return databaseQuery(queryText, params);
}

/**
 * Updates an existing user in the 'users' table of the database.
 *
 * @param {string} userId The corresponding user Id (ger. 'Benutzerkennung'). Cannot be empty.
 * @param {string} email The corresponding mail address (ger. 'E-Mail Adresse'). Cannot be empty.
 * @param {string} firstName The first name(s) of the user (ger. 'Vorname(n)'). Cannot be empty.
 * @param {string} lastName The sir name of the user (ger. 'Nachname'). Cannot be empty.
 * @param {string} studentId The student Id of the user (ger. 'Matrikelnummer').
 * @param {boolean} verified Whether the user is verified or not (ger. 'Verifikationsstatus'). Cannot be empty.
 */
export function updateUser(userId, email, firstName = null, lastName = null, studentId = null, verified = false) {
  // columns of table 'user': userId, email, firstName, lastName, studentId, isEmailVerified
  const queryText = 'UPDATE users Set email = $2, firstName = $3, lastName = $4, studentId = $5, isEmailVerified = $6 WHERE userId = $1';
  const params = [userId, email, firstName, lastName, studentId, verified];
  return databaseQuery(queryText, params);
}

/**
 * Updates just the mail and verified fields for a user in
 * the 'users' table of the database.
 *
 * @param {string} userId The corresponding user Id (ger. 'Benutzerkennung'). Cannot be empty.
 * @param {string} email The corresponding mail address (ger. 'E-Mail Adresse'). Cannot be empty.
 * @param {boolean} verified Whether the user is verified or not (ger. 'Verifikationsstatus'). Cannot be empty.
 */
export function updateMailAndVerified(userId, email, verified) {
  // columns of table 'user': userId, email, firstName, lastName, studentId, isEmailVerified
  const queryText = 'UPDATE users Set email = $2, isEmailVerified = $3 WHERE userId = $1';
  const params = [userId, email, verified];
  return databaseQuery(queryText, params);
}

/**
 * Updates an existing user or inserts a new user if the primary key
 * 'userId' cannot be found at the 'users' table of the database.
 *
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
  return databaseQuery(queryText, params);
}

/**
 * Returns all active users.
 */
export const selectAllUsers = async () => {
  const queryText = 'SELECT * FROM users where isactive = $1;';
  const params = [true];
  const res = await databaseQuery(queryText, params);
  return res.rows;
};

/**
 * Returns a user.
 *
 * @param {string} userId the user id.
 * @returns {Promise<object>} the user.
 */
export const selectUser = async (userId) => {
  const queryText = 'SELECT * FROM users where userId = $1 and isactive = true';
  const params = [userId];
  return await databaseQuery(queryText, params);
};

/**
 * Updates the biography of the given user.
 *
 * @param {string} userId
 * @param {string} biography
 */
export function setBiography(userId, biography) {
  const queryText = 'UPDATE users SET biography = $2 WHERE userId = $1';
  const params = [userId, biography];
  return databaseQuery(queryText, params);
}

export const selectCourses = async (userId) => {
  const queryText = `
    SELECT title, yearcode 
    FROM users
    JOIN attends ON users.userid = attends.userid 
    JOIN courses ON courses.id = attends.courseid 
    WHERE users.userid = $1 AND (islecturer OR ismodulecoordinator OR isstudent)`;
  const params = [userId];
  return await databaseQuery(queryText, params);
};

export const selectOpenHomeworks = async (userId) => {
  const queryText = `
    SELECT homeworks.id, homeworkname, doingstart, doingend, title, yearcode 
    FROM homeworks
    JOIN courses ON homeworks.courseid = courses.id
    where courses.id IN (
      SELECT courseid FROM attends 
      WHERE userid = $1 and (islecturer OR ismodulecoordinator OR isstudent)
    ) AND (
      SELECT count(*)
      FROM solutions
      WHERE userId = $1 AND homeworkid = homeworks.id
    ) = 0 AND
    doingstart <= NOW() AND
    doingend > NOW()
  `;
  const params = [userId];
  return await databaseQuery(queryText, params);
};

export const selectOpenReviews = async (userId) => {
  const queryText = `
    SELECT reviews.id, homeworkname, correctingstart, correctingend, title, yearcode
    FROM reviews 
    JOIN solutions ON reviews.solutionid = solutions.id 
    JOIN homeworks ON solutions.homeworkid = homeworks.id 
    JOIN courses ON homeworks.courseid = courses.id 
    WHERE reviews.userid = $1 AND 
    percentagegrade is null AND
    correctingstart <= NOW() AND
    correctingend > NOW()
  `;
  const params = [userId];
  return await databaseQuery(queryText, params);
};

export const selectOpenReviewAudits = async (userId) => {
  const queryText = `
    SELECT reviewaudits.id, homeworkname, title, yearcode, studentid
    FROM reviewaudits
    JOIN reviews ON reviewaudits.reviewid = reviews.id
    JOIN solutions ON reviews.solutionid = solutions.id 
    JOIN homeworks ON solutions.homeworkid = homeworks.id 
    JOIN courses ON homeworks.courseid = courses.id
    JOIN users ON reviews.userid = users.userid
    WHERE resolved = false and courses.id IN (
      SELECT courseid 
      FROM attends 
      WHERE userid = $1 and (
        (islecturer AND homeworks.correctionvalidation = 'lecturers') OR 
        (ismodulecoordinator AND homeworks.correctionvalidation = 'coordinator')
      )
    )
  `;
  const params = [userId];
  return await databaseQuery(queryText, params);
};
