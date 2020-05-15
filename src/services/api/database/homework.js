/**
 *
 * Date created: 25.04.2020
 * Author: Luca Lenhard/ Simon Busse
 *
 * Functionality: Adds homework into database
 */

import { databaseQuery } from '.';

/**
 * Inserts a new user into the 'homeworks' table of the database.
 *
 * @param {Blob} exercise
 * @param {Blob} solution
 * @param {Blob} evaluation
 * @param {TimeStamp} doingStart
 * @param {TimeStamp} doingEnd
 * @param {TimeStamp} correctingStart
 * @param {TimeStamp} correctingEnd
 * @param {Array} dataFormat
 * @param {string} correctingType
 * @param {integer} correctingAmountStudent
 * @param {integer} correctingAmountProf
 * @param {float} criticalEvaluation
 * @returns {Promise<import('pg').QueryResult<any>>} The query result.
 */
export function insertUser(exercise, solution, evaluation, doingStart, doingEnd, correctingStart, correctingEnd, dataFormat, correctingType, correctingAmountStudent, correctingAmountProf, criticalEvaluation) {
  // columns of table 'homeworks': exercise, solution, evaluation, doingStart, doingEnd, correctingStart, correctingEnd, dataFormat, correctingType, correctingAmountStudent, correctingAmountProf, criticalEvaluation
  const queryText = 'INSERT INTO homeworks(exercise, solution, evaluation, doingStart, doingEnd, correctingStart, correctingEnd, dataFormat, correctingType, correctingAmountStudent, correctingAmountProf, criticalEvaluation) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *';
  const params = [exercise, solution, evaluation, doingStart, doingEnd, correctingStart, correctingEnd, dataFormat, correctingType, correctingAmountStudent, correctingAmountProf, criticalEvaluation];
  return databaseQuery(queryText, params);
}
