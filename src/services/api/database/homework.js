import { databaseTransaction } from '.';
/**
 * Inserts a new user into the 'homeworks' table of the database.
 *
 * @param {string} homeworkName
 * @param {string[]} courses
 * @param {number} maxReachablePoints
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
 * @param {string} exerciseAssignmentName
 * @param {string} modelSolution
 * @param {string} modelSolutionName
 * @param {string} evaluationScheme
 * @param {string} evaluationSchemeName
 * @param {Date} creationDate
 * @param {string} creator
 */
export const insertHomework = async (
  homeworkName,
  courses,
  maxReachablePoints,
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
  exerciseAssignmentName,
  modelSolution,
  modelSolutionName,
  evaluationScheme,
  evaluationSchemeName,
  creationDate,
  creator,
) => {
  return databaseTransaction(async (client) => {
    const queryText = 'INSERT INTO homeworks(homeworkName, maxReachablePoints, courseId, evaluationVariant, correctionVariant, correctionValidation, samplesize, threshold, solutionAllowedFormats, correctionAllowedFormats, doingStart, doingEnd, correctingStart, correctingEnd, exerciseAssignment, exerciseAssignmentName, modelSolution, modelSolutionName, evaluationScheme, evaluationSchemeName, creationDate, creator) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) ';

    for (const courseId of courses) {
      const params = [
        homeworkName,
        maxReachablePoints,
        courseId,
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
        [exerciseAssignmentName],
        [modelSolution],
        [modelSolutionName],
        [evaluationScheme],
        [evaluationSchemeName],
        creationDate,
        creator,
      ];
      await client.query(queryText, params);
    }
  });
};

/**
 * Updates a homework in 'homeworks' table of the database.
 *
 * @param {string} homeworkName
 * @param {number} maxReachablePoints
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
 * @param {string} exerciseAssignmentName
 * @param {string} modelSolution
 * @param {string} modelSolutionName
 * @param {string} evaluationScheme
 * @param {string} evaluationSchemeName
 * @param {number} homeworkId
 */
export const updateHomework = async (
  homeworkName,
  maxReachablePoints,
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
  exerciseAssignmentName,
  modelSolution,
  modelSolutionName,
  evaluationScheme,
  evaluationSchemeName,
  homeworkId,
) => {
  return databaseTransaction(async (client) => {
    const queryText = 'UPDATE homeworks SET homeworkName = $1, maxReachablePoints = $2, evaluationVariant = $3, correctionVariant = $4, correctionValidation = $5, samplesize = $6, threshold = $7, solutionAllowedFormats = $8, correctionAllowedFormats = $9, doingStart = $10, doingEnd = $11, correctingStart = $12, correctingEnd = $13, exerciseAssignment = $14, exerciseAssignmentName = $15, modelSolution = $16, modelSolutionName = $17, evaluationScheme = $18, evaluationSchemeName = $19 WHERE id = $20 ';

    const params = [
      homeworkName,
      maxReachablePoints,
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
      [exerciseAssignmentName],
      [modelSolution],
      [modelSolutionName],
      [evaluationScheme],
      [evaluationSchemeName],
      homeworkId,
    ];
    await client.query(queryText, params);
  });
};

/**
 *
 * @param {number} homeworkId
 */
export const selectHomework = async (
  homeworkId,
) => {
  return databaseTransaction(async (client) => {
    const queryText = 'SELECT * FROM homeworks WHERE id = $1 ';

    const params = [
      homeworkId,
    ];
    await client.query(queryText, params);
  });
};

export default (selectHomework, insertHomework, updateHomework);
