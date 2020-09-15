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
 * @param {string} exercise
 * @param {string} solution
 * @param {string} evaluation
 * @param {Date} doingStart
 * @param {Date} doingEnd
 * @param {Date} correctingStart
 * @param {Date} correctingEnd
 * @param {string[]} dataFormat
 * @param {string} correctingType
 * @param {number} correctingAmountStudent
 * @param {number} correctingAmountProf
 * @param {number} criticalEvaluation
 */
export default function insertHomework(
  exercise,
  solution,
  evaluation,
  doingStart,
  doingEnd,
  correctingStart,
  correctingEnd,
  dataFormat,
  correctingType,
  correctingAmountStudent,
  correctingAmountProf,
  criticalEvaluation,
) {
  // columns of table 'homeworks': exercise, solution, evaluation, doingStart, doingEnd, correctingStart, correctingEnd, dataFormat, correctingType, correctingAmountStudent, correctingAmountProf, criticalEvaluation
  const queryText = 'INSERT INTO homeworks(exercise, solution, evaluation, doingStart, doingEnd, correctingStart, correctingEnd, dataFormat, correctingType, correctingAmountStudent, correctingAmountProf, criticalEvaluation) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *';
  const params = [
    exercise,
    solution,
    evaluation,
    doingStart,
    doingEnd,
    correctingStart,
    correctingEnd,
    dataFormat,
    correctingType,
    correctingAmountStudent,
    correctingAmountProf,
    criticalEvaluation,
  ];
  return databaseQuery(queryText, params);
}

/**
 * @param rcdf
 * rcdf = requirecorrectingdocumentationfile
 */
export function selectHomeworkUnfinished(rcdf) {
  const queryText = 'SELECT * FROM homeworks JOIN refers ON (refers.homeworksid = homeworks.id) JOIN courses ON (courses.id = refers.coursesid) WHERE requirecorrectingdocumentationfile = TRUE';
  const params = [rcdf];
  return databaseQuery(queryText, params);
}
