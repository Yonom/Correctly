import { databaseTransaction, databaseQuery } from '.';
import { SQL_FOR_PERCENTAGE_GRADE } from '../../../utils/percentageGradeConst';
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
  creator,
) => {
  return databaseTransaction(async (client) => {
    const queryText = 'INSERT INTO homeworks(homeworkName, maxReachablePoints, courseId, evaluationVariant, correctionVariant, correctionValidation, samplesize, threshold, solutionAllowedFormats, correctionAllowedFormats, doingStart, doingEnd, correctingStart, correctingEnd, exerciseAssignment, exerciseAssignmentName, modelSolution, modelSolutionName, evaluationScheme, evaluationSchemeName, creationDate, creator) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), $21) ';

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

export const selectHomework = async (homeworkId) => {
  const queryText = 'SELECT homeworks.*, courses.yearcode as yearcode, courses.title as title FROM homeworks INNER JOIN courses ON homeworks.courseid = courses.id WHERE homeworks.id = $1';
  const params = [homeworkId];
  return databaseQuery(queryText, params);
};

/**
 * returns homeworks for a specific course.
 *
 * @param {number} courseId
 */
export const selectHomeworksForCourse = async (courseId) => {
  const queryText = 'select homeworks.id, homeworkname, doingend::DECIMAL from homeworks WHERE courseid = $1;';
  const params = [courseId];
  return await databaseQuery(queryText, params);
};

export const selectHomeworksForDistributionOfAudits = () => {
  const queryText = `SELECT id, courseid, correctionvariant, threshold, samplesize
  FROM homeworks
  WHERE hasdistributedaudits IS FALSE AND
  correctingend <= NOW()`;
  const params = [];
  return databaseQuery(queryText, params);
};

export const selectHomeworksForDistributionOfReviews = () => {
  const queryText = `SELECT id, courseid, correctionvariant
  FROM homeworks
  WHERE hasdistributedreviews IS FALSE AND
  correctingstart <= NOW()`;
  const params = [];
  return databaseQuery(queryText, params);
};

export const selectHomeworksAndGradesForCourseAndUser = async (courseId, userId) => {
  const queryText = `
    SELECT homeworks.id, homeworkname, maxreachablepoints, AVG(percentagegrade) AS percentageGrade
    FROM homeworks
    LEFT JOIN solutions on solutions.homeworkid = homeworks.id and solutions.userid = $2
    ${SQL_FOR_PERCENTAGE_GRADE}
    WHERE courseid = $1
    GROUP BY homeworks.*
  `;
  const params = [courseId, userId];
  return await databaseQuery(queryText, params);
};
