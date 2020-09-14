/**
 *
 * Date created: 25.04.2020
 * Author: Luca Lenhard/ Simon Busse
 *
 * Functionality: Adds homework into database
 *
 * {string} homeworkName
 * {string[]} courses
 * {number} maxReachablePoints
 * {boolean} requireCorrectingDocumentationFile
 * {string} evaluationVariant
 * {string} correctionVariant
 * {string} correctionValidation
 * {number} samplesize
 * {number} threshold
 * {string[]} solutionAllowedFormats
 * {string[]} correctionAllowedFormats
 * {Date} doingStart
 * {Date} doingEnd
 * {Date} correctingStart
 * {Date} correctingEnd
 * {string} exerciseAssignment
 * {string} modelSolution
 * {string} evaluationScheme
 *
 */

import { databaseQuery } from '.';

/**
 * Inserts a new user into the 'homeworks' table of the database.
 *
 * @param {string} homeworkName
 * @param {string[]} courses
 * @param {number} maxReachablePoints
 * @param {boolean} requireCorrectingDocumentationFile
 * @param {string} evaluationVariant
 * @param {string} correctionVariant
 * @param {string} correctionValidation
 * @param {number} samplesize
 * @param {number} threshold
 * @param {string[]} solutionAllowedFormats
 * @param {string[]} correctionAllowedFormats
 * @param {Date} doingStart
 * @param {Date} doingEnd
 * @param {Date} correctingStart
 * @param {Date} correctingEnd
 * @param {string} exerciseAssignment
 * @param {string} modelSolution
 * @param {string} evaluationScheme
 */
export default function insertHomework(
  homeworkName,
  courses,
  maxReachablePoints,
  requireCorrectingDocumentationFile,
  evaluationVariant,
  correctionVariant,
  correctionValidation,
  samplesize,
  threshold,
  solutionAllowedFormats,
  correctionAllowedFormats,
  doingStart,
  doingEnd,
  correctingStart,
  correctingEnd,
  exerciseAssignment,
  modelSolution,
  evaluationScheme,
) {
  const queryText = 'INSERT INTO homeworks(homeworkName, maxReachablePoints, requireCorrectingDocumentationFile, evaluationVariant, correctionVariant, correctionValidation, samplesize, threshold, solutionAllowedFormats, correctionAllowedFormats, doingStart, doingEnd, correctingStart, correctingEnd, exerciseAssignment, modelSolution, evaluationScheme) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *';
  // eslint-disable-next-line no-console
  console.log('HALLO FILE 3');
  const params = [
    homeworkName,
    maxReachablePoints,
    requireCorrectingDocumentationFile,
    evaluationVariant,
    correctionVariant,
    correctionValidation,
    samplesize,
    threshold,
    solutionAllowedFormats,
    correctionAllowedFormats,
    doingStart,
    doingEnd,
    correctingStart,
    correctingEnd,
    [exerciseAssignment],
    [modelSolution],
    [evaluationScheme],
  ];
  return databaseQuery(queryText, params);
}
