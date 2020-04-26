/**
 *
 * Date created: 25.04.2020
 * Author: Robin Rinn
 *
 * Functionality: Receives authentification from user and
 * updates user data in the database
 */

import { databaseQuery } from '../../services/api/database';

/**
 * Returns the email adress and verified status of a
 * given user by their id.
 *
 * ==========================
 * !!!    DUMMY CODED     !!!
 * ==========================
 *
 * TODO:
 *  - Actual implementation (incl. switching between
 *    CSV Auth and Firebase)
 *
 * @param {number} userId The corresponding user Id.
 * @returns {[string, boolean]} Email and isVerified status
 */
function getEmailAndIsVerified(userId) {
  const email = 'testmail@test.de';
  const isEmailVerified = true;

  return [email, isEmailVerified];
}

/**
 * Inserts a new user into the 'users' table of the database.
 *
 * TODO: Exception Handling
 *
 * @param {number} userId The corresponding user Id (ger. 'Benutzerkennung'). Cannot be empty.
 * @param {string} email The corresponding mail address (ger. 'E-Mail Adresse'). Cannot be empty.
 * @param {string} firstName The first name(s) of the user (ger. 'Vorname(n)'). Cannot be empty.
 * @param {string} lastName The sir name of the user (ger. 'Nachname'). Cannot be empty.
 * @param {string} studentId The student Id of the user (ger. 'Matrikelnummer').
 * @param {boolean} verified Whether the user is verified or not (ger. 'Verifikationsstatus'). Cannot be empty.
 */
function insertUser(userId, email, firstName = null, lastName = null, studentId = null, verified = false) {
  // columns of table 'user': userId, email, firstName, lastName, studentId, isEmailVerified
  const queryText = 'INSERT INTO users(userId, email, firstName, lastName, studentId, isEmailVerified) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';

  let _userId; let _email; let _firstName; let _lastName; let _studentId; let
    _verified;
  // TODO?: check whether database is available
  try {
    // cast values into correct types in case they have the wrong types
    _userId = Number(userId);
    _email = String(email);
    _firstName = String(firstName);
    _lastName = String(lastName);
    _studentId = Number(studentId);
    _verified = Boolean(verified);

    const params = [_userId, _email, _firstName, _lastName, _studentId, _verified];
    databaseQuery(queryText, params);

    // For a quick look into the sent data (should be deleted later):
    // printUserEntries();
  } catch (err) {
    console.log(`${err.message}2`);
  }
}

/**
 * Updates an existing user in the 'users' table of the database.
 *
 * TODO: Exception Handling
 *
 * @param {number} userId The corresponding user Id (ger. 'Benutzerkennung'). Cannot be empty.
 * @param {string} email The corresponding mail address (ger. 'E-Mail Adresse'). Cannot be empty.
 * @param {string} firstName The first name(s) of the user (ger. 'Vorname(n)'). Cannot be empty.
 * @param {string} lastName The sir name of the user (ger. 'Nachname'). Cannot be empty.
 * @param {string} studentId The student Id of the user (ger. 'Matrikelnummer').
 * @param {boolean} verified Whether the user is verified or not (ger. 'Verifikationsstatus'). Cannot be empty.
 */
function updateUser(userId, email, firstName = null, lastName = null, studentId = null, verified = false) {
  // columns of table 'user': userId, email, firstName, lastName, studentId, isEmailVerified
  const queryText = 'UPDATE users Set email = $2, firstName = $3, lastName = $4, studentId = $5, isEmailVerified = $6 WHERE userId = $1';
  let _userId; let _email; let _firstName; let _lastName; let _studentId; let
    _verified;
  try {
    // cast values into correct types in case they have the wrong types
    _userId = Number(userId);
    _email = String(email);
    _firstName = String(firstName);
    _lastName = String(lastName);
    _studentId = Number(studentId);
    _verified = Boolean(verified);

    const params = [_userId, _email, _firstName, _lastName, _studentId, _verified];
    databaseQuery(queryText, params);

    // For a quick look into the sent data (should be deleted later):
    // printUserEntries();
  } catch (err) {
    console.log(err.message);
  }
}

/**  The api entry point. Can be accessed via Route:
 *     /api/updateUserData
 *
 * The following parameters will be extracted from the body of the request.
 *
 * @param {string} api The api key (in case we need that).
 * @param {number} userId The user Id (ger. 'Benutzerkennung'). Cannot be empty.
 * @param {string} firstName The first name(s) of the user (ger. 'Vorname(n)'). Cannot be empty.
 * @param {string} lastName The sir name of the user (ger. 'Nachname'). Cannot be empty.
 * @param {string} studentId The student Id of the user (ger. 'Matrikelnummer').
 */

export default (req, res) => {
  try {
    if (req.method === 'POST') {
      // read the parameters from the body.
      // ? Or should we rather pass them in the URL ?
      let userId; let firstName; let lastName; let
        studentId;
      try {
        // ? Do we need to use an api key here ?
        userId = req.body.userId;
        firstName = req.body.firstName;
        lastName = req.body.lastName;
        studentId = req.body.studentId;
      } catch (ex) {
        // If There is a problem witht the parameters,
        // return 400 'Bad Request'.
        return res.status(400).json({});
      }
      const [email, isEmailVerified] = getEmailAndIsVerified(userId);
      // depending on the further implentation, we will differentiate
      // between insert and update user
      insertUser(userId, email, firstName, lastName, studentId, isEmailVerified);
      return res.status(200).json({});
    }
    // Return 405 'Method Not Allowed' if anything else but
    // a 'POST' Request is used
    return res.writeHead(405, { Allow: 'POST' }).end();
  } catch (err) {
    console.log(err.message);
    res.status(500).json({});
  }
};