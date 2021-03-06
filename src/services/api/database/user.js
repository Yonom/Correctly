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
  const queryText = 'SELECT * FROM users WHERE isactive AND isemailverified ORDER BY users.firstname, users.lastname, users.userid;';
  const params = [];
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
  const queryText = 'SELECT * FROM users WHERE userId = $1 AND isactive AND isemailverified';
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
    SELECT courses.id, title, yearcode
    FROM users
    JOIN attends ON users.userid = attends.userid 
    JOIN courses ON courses.id = attends.courseid 
    WHERE users.userid = $1 
    AND isactive AND isemailverified
    AND (islecturer OR ismodulecoordinator OR isstudent)
    ORDER BY courses.yearcode, courses.title, courses.id`;
  const params = [userId];
  return await databaseQuery(queryText, params);
};

export const selectOpenHomeworks = async (userId) => {
  const queryText = `
    SELECT homeworks.id, homeworkname, solutionstart, solutionend, title, yearcode 
    FROM homeworks
    JOIN courses ON homeworks.courseid = courses.id
    WHERE courses.id IN (
      SELECT courseid FROM attends
      INNER JOIN users ON users.userid = attends.userid 
      WHERE users.userid = $1 
      AND isactive AND isemailverified 
      AND isstudent
    ) AND (
      SELECT count(*)
      FROM solutions
      WHERE userId = $1 AND homeworkid = homeworks.id
    ) = 0
    AND solutionstart <= NOW()
    AND solutionend > NOW()
    ORDER BY courses.yearcode, courses.title, courses.id, homeworks.creationdate, homeworks.id
  `;
  const params = [userId];
  return await databaseQuery(queryText, params);
};

export const selectOpenReviews = async (userId) => {
  const queryText = `
    SELECT reviews.id, homeworkname, reviewstart, reviewend, title, yearcode
    FROM reviews 
    JOIN solutions ON reviews.solutionid = solutions.id 
    JOIN homeworks ON solutions.homeworkid = homeworks.id 
    JOIN courses ON homeworks.courseid = courses.id 
    WHERE reviews.userid = $1 
    AND reviews.issubmitted = false
    AND NOT reviews.issystemreview
    AND (
      reviews.islecturerreview 
      OR (
        homeworks.reviewend > NOW() 
        AND homeworks.reviewstart <= NOW()
      )
    )
    AND reviews.isvisible
    ORDER BY courses.yearcode, courses.title, courses.id, homeworks.creationdate, homeworks.id, reviews.id
  `;
  const params = [userId];
  return await databaseQuery(queryText, params);
};

export const selectOpenAudits = async (userId) => {
  const queryText = `
    SELECT homeworks.id, solutions.userid, audits.solutionid, homeworkname, title, yearcode, audits.reason, audits.plagiarismid
    FROM audits
    JOIN solutions ON audits.solutionid = solutions.id 
    JOIN homeworks ON solutions.homeworkid = homeworks.id 
    JOIN courses ON homeworks.courseid = courses.id
    WHERE isresolved = false and courses.id IN (
      SELECT courseid 
      FROM attends
      INNER JOIN users ON users.userid = attends.userid 
      WHERE users.userid = $1 AND isactive AND isemailverified AND (
        (islecturer AND homeworks.auditors = 'lecturers') OR 
        (ismodulecoordinator AND homeworks.auditors = 'modulecoordinator')
      )
    )
    ORDER BY courses.yearcode, courses.title, courses.id, homeworks.creationdate, homeworks.id, audits.reason, audits.plagiarismid, audits.solutionid
  `;
  const params = [userId];
  return await databaseQuery(queryText, params);
};
