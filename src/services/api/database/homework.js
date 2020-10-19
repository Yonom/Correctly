import { databaseTransaction, databaseQuery } from '.';
import { SQL_FOR_PERCENTAGE_GRADE } from '../../../utils/constants';
/**
 * Inserts a new user into the 'homeworks' table of the database.
 *
 * @param {string} homeworkName
 * @param {string[]} courses
 * @param {number} maxReachablePoints
 * @param {string} evaluationVariant
 * @param {string} reviewerCount
 * @param {string} auditors
 * @param {number} samplesize
 * @param {number} threshold
 * @param {string[]} solutionAllowedFormats
 * @param {string[]} reviewAllowedFormats
 * @param {Date} solutionStart
 * @param {Date} solutionEnd
 * @param {Date} reviewStart
 * @param {Date} reviewEnd
 * @param {string} taskFiles
 * @param {string} taskFileNames
 * @param {string} sampleSolutionFiles
 * @param {string} sampleSolutionFileNames
 * @param {string} evaluationSchemeFiles
 * @param {string} evaluationSchemeFileNames
 * @param {string} creator
 */
export const insertHomework = async (
  homeworkName,
  courses,
  maxReachablePoints,
  evaluationVariant,
  reviewerCount,
  auditors,
  samplesize,
  threshold,
  solutionAllowedFormats,
  reviewAllowedFormats,
  solutionStart,
  solutionEnd,
  reviewStart,
  reviewEnd,
  taskFiles,
  taskFileNames,
  sampleSolutionFiles,
  sampleSolutionFileNames,
  evaluationSchemeFiles,
  evaluationSchemeFileNames,
  creator,
) => {
  return databaseTransaction(async (client) => {
    const queryText = 'INSERT INTO homeworks(homeworkName, maxReachablePoints, courseId, evaluationVariant, reviewerCount, auditors, samplesize, threshold, solutionAllowedFormats, reviewAllowedFormats, solutionStart, solutionEnd, reviewStart, reviewEnd, taskFiles, taskFileNames, sampleSolutionFiles, sampleSolutionFileNames, evaluationSchemeFiles, evaluationSchemeFileNames, creationDate, creator) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), $21) ';

    for (const courseId of courses) {
      const params = [
        homeworkName,
        maxReachablePoints,
        courseId,
        evaluationVariant,
        reviewerCount,
        auditors,
        samplesize,
        threshold,
        solutionAllowedFormats,
        reviewAllowedFormats,
        solutionStart,
        solutionEnd,
        reviewStart,
        reviewEnd,
        [taskFiles],
        [taskFileNames],
        [sampleSolutionFiles],
        [sampleSolutionFileNames],
        [evaluationSchemeFiles],
        [evaluationSchemeFileNames],
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
 * @param {string} reviewerCount
 * @param {string} auditors
 * @param {number} samplesize
 * @param {number} threshold
 * @param {string[]} solutionAllowedFormats
 * @param {string[]} reviewAllowedFormats
 * @param {Date} solutionStart
 * @param {Date} solutionEnd
 * @param {Date} reviewStart
 * @param {Date} reviewEnd
 * @param {string} taskFiles
 * @param {string} taskFileNames
 * @param {string} sampleSolutionFiles
 * @param {string} sampleSolutionFileNames
 * @param {string} evaluationSchemeFiles
 * @param {string} evaluationSchemeFileNames
 * @param {number} homeworkId
 */
export const updateHomework = async (
  homeworkName,
  maxReachablePoints,
  evaluationVariant,
  reviewerCount,
  auditors,
  samplesize,
  threshold,
  solutionAllowedFormats,
  reviewAllowedFormats,
  solutionStart,
  solutionEnd,
  reviewStart,
  reviewEnd,
  taskFiles,
  taskFileNames,
  sampleSolutionFiles,
  sampleSolutionFileNames,
  evaluationSchemeFiles,
  evaluationSchemeFileNames,
  homeworkId,
) => {
  return databaseTransaction(async (client) => {
    const queryText = 'UPDATE homeworks SET homeworkname = $1, maxreachablepoints = $2, evaluationvariant = $3, reviewercount = $4, auditors = $5, samplesize = $6, threshold = $7, solutionallowedformats = $8, reviewallowedformats = $9, solutionstart = $10, solutionend = $11, reviewstart = $12, reviewend = $13 WHERE id = $14 ';
    const queryTextTask = 'UPDATE homeworks SET taskfiles = $1, taskfilenames = $2 WHERE id = $3 ';
    const queryTextSampleSolution = 'UPDATE homeworks SET samplesolutionfiles = $1, samplesolutionfilenames = $2 WHERE id = $3 ';
    const queryTextEvaluationScheme = 'UPDATE homeworks SET evaluationschemefiles = $1, evaluationschemefilenames = $2 WHERE id = $3 ';

    if (taskFiles !== undefined) {
      const params = [
        [taskFiles],
        [taskFileNames],
        homeworkId,
      ];
      await client.query(queryTextTask, params);
    }
    if (sampleSolutionFiles !== undefined) {
      const params = [
        [sampleSolutionFiles],
        [sampleSolutionFileNames],
        homeworkId,
      ];
      await client.query(queryTextSampleSolution, params);
    }
    if (evaluationSchemeFiles !== undefined) {
      const params = [
        [evaluationSchemeFiles],
        [evaluationSchemeFileNames],
        homeworkId,
      ];
      await client.query(queryTextEvaluationScheme, params);
    }

    const params = [
      homeworkName,
      maxReachablePoints,
      evaluationVariant,
      reviewerCount,
      auditors,
      samplesize,
      threshold,
      solutionAllowedFormats,
      reviewAllowedFormats,
      solutionStart,
      solutionEnd,
      reviewStart,
      reviewEnd,
      homeworkId,
    ];
    return client.query(queryText, params);
  });
};

export const selectEditableHomeworksForUser = async (userId, isSuperuser) => {
  const queryText = `
  SELECT homeworks.id as id, homeworkname, courses.yearcode as yearcode, courses.title as title, creator.firstname as firstname, creator.lastname as lastname, solutionstart, solutionend, reviewstart, reviewend
    FROM homeworks
    INNER JOIN courses ON homeworks.courseid = courses.id
    INNER JOIN attends ON courses.id = attends.courseid 
    INNER JOIN users AS creator ON homeworks.creator = creator.userid
    INNER JOIN users ON attends.userid = users.userid
    WHERE users.userid = $1 
    AND users.isactive AND users.isemailverified 
    AND (islecturer OR ismodulecoordinator OR $2)
  `;
  const params = [userId, isSuperuser];
  return databaseQuery(queryText, params);
};

export const selectHomeworkForUser = async (homeworkId, userId, isSuperuser) => {
  const queryText = `
    SELECT 
      homeworks.id, 
      homeworks.homeworkname, 
      homeworks.courseid, 
      homeworks.maxreachablepoints, 
      homeworks.evaluationvariant, 
      homeworks.reviewercount, 
      homeworks.auditors, 
      homeworks.samplesize, 
      homeworks.threshold, 
      homeworks.solutionallowedformats, 
      homeworks.reviewallowedformats, 
      homeworks.solutionstart, 
      homeworks.solutionend, 
      homeworks.reviewstart, 
      homeworks.reviewend, 
      homeworks.creator, 
      homeworks.creationdate, 
      homeworks.hasdistributedreviews, 
      homeworks.hasdistributedaudits, 
      homeworks.taskfilenames,
      homeworks.samplesolutionfilenames,
      homeworks.evaluationschemefilenames,
      courses.yearcode, 
      courses.title
    FROM homeworks 
    INNER JOIN courses ON homeworks.courseid = courses.id 
    INNER JOIN attends ON courses.id = attends.courseid 
    INNER JOIN users ON attends.userid = users.userid
    WHERE homeworks.id = $1
    AND users.userid = $2 
    AND users.isactive AND users.isemailverified 
    AND (islecturer OR ismodulecoordinator OR isstudent OR $3)
  `;
  const params = [homeworkId, userId, isSuperuser];
  return databaseQuery(queryText, params);
};

export const selectHomeworkEvaluationSchemeForUser = async (homeworkId, userId, isSuperuser) => {
  const queryText = `
    SELECT homeworks.evaluationschemefilenames, homeworks.evaluationschemefiles
    FROM homeworks 
    INNER JOIN courses ON homeworks.courseid = courses.id 
    INNER JOIN attends ON courses.id = attends.courseid 
    INNER JOIN users ON attends.userid = users.userid
    WHERE homeworks.id = $1
    AND users.userid = $2 
    AND users.isactive AND users.isemailverified 
    AND (
      $3 OR 
      islecturer OR 
      ismodulecoordinator OR 
      (isstudent AND reviewstart <= NOW())
    )
  `;
  const params = [homeworkId, userId, isSuperuser];
  return databaseQuery(queryText, params);
};

export const selectHomeworkSampleSolutionForUser = async (homeworkId, userId, isSuperuser) => {
  const queryText = `
    SELECT homeworks.samplesolutionfilenames, homeworks.samplesolutionfiles
    FROM homeworks 
    INNER JOIN courses ON homeworks.courseid = courses.id 
    INNER JOIN attends ON courses.id = attends.courseid 
    INNER JOIN users ON attends.userid = users.userid
    WHERE homeworks.id = $1
    AND users.userid = $2 
    AND users.isactive AND users.isemailverified 
    AND (
      $3 OR 
      islecturer OR 
      ismodulecoordinator OR 
      (isstudent AND reviewstart <= NOW())
    )
  `;
  const params = [homeworkId, userId, isSuperuser];
  return databaseQuery(queryText, params);
};
export const selectHomeworkTaskForUser = async (homeworkId, userId, isSuperuser) => {
  const queryText = `
    SELECT homeworks.taskfilenames, homeworks.taskfiles
    FROM homeworks 
    INNER JOIN courses ON homeworks.courseid = courses.id 
    INNER JOIN attends ON courses.id = attends.courseid 
    INNER JOIN users ON attends.userid = users.userid
    WHERE homeworks.id = $1
    AND users.userid = $2 
    AND users.isactive AND users.isemailverified 
    AND (
      $3 OR 
      islecturer OR 
      ismodulecoordinator OR 
      isstudent
    )
  `;
  const params = [homeworkId, userId, isSuperuser];
  return databaseQuery(queryText, params);
};

/**
 * returns homeworks for a specific course.
 *
 * @param {number} courseId
 */
export const selectHomeworksForCourse = async (courseId) => {
  const queryText = 'select homeworks.id, homeworkname, solutionend from homeworks WHERE courseid = $1;';
  const params = [courseId];
  return await databaseQuery(queryText, params);
};

export const selectHomeworksForDistributionOfAudits = () => {
  const queryText = `SELECT id, courseid, reviewercount, threshold, samplesize
  FROM homeworks
  WHERE hasdistributedaudits IS FALSE
  AND reviewend <= NOW()`;
  const params = [];
  return databaseQuery(queryText, params);
};

export const selectHomeworksForDistributionOfReviews = () => {
  const queryText = `SELECT id, courseid, reviewercount
  FROM homeworks
  WHERE hasdistributedreviews IS FALSE
  AND reviewstart <= NOW()`;
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
