import { databaseQuery, databaseTransaction } from '.';
import { ONE_REVIEWER, TWO_REVIEWERS } from '../../../utils/constants';

const createParamsForDistributedHomeworks = (solutionList, reviewerCount) => {
  // convert reviewerCount into Integer
  let reviewers;
  if (reviewerCount === ONE_REVIEWER) {
    reviewers = 1;
  } else if (reviewerCount === TWO_REVIEWERS) {
    reviewers = 2;
  } else {
    throw new Error(`too many correctors (${reviewerCount}) in Homework`);
  }

  const params = [];
  const shiftedList = [...solutionList];
  for (let j = 1; j <= reviewers; j++) {
    shiftedList.push(shiftedList.shift());
    params.push(...solutionList.map(({ userid }, i) => {
      return [userid, shiftedList[i].id];
    }));
  }

  return params;
};

/**
 * @param {object[]} solutionList
 * @param {string} reviewerCount
 * @param {string} homeworkId
 */
export async function createReviews(solutionList, reviewerCount, homeworkId) {
  return databaseTransaction(async (client) => {
    const queryText1 = 'INSERT INTO reviews(userid, solutionid) VALUES($1, $2)';
    const params1Collection = createParamsForDistributedHomeworks(solutionList, reviewerCount);
    for (const params1 of params1Collection) {
      await client.query(queryText1, params1);
    }

    // Upadting the homework
    const queryText2 = `UPDATE homeworks
    SET hasdistributedreviews = true
    WHERE id = $1`;
    const params2 = [homeworkId];
    await client.query(queryText2, params2);
  });
}

/**
 * @param {string} homeworkId
 * @param {string} courseId
 */
export const selectUsersWithoutReview = async (homeworkId, courseId) => {
  const queryText = `
    SELECT attends.userid
    FROM attends
    WHERE attends.courseid = $2 AND attends.isstudent
    AND (
      SELECT COUNT(*)
      FROM reviews
      JOIN solutions ON solutions.id = reviews.solutionid
      WHERE reviews.userid = attends.userid 
      AND solutions.homeworkid = $1 
      AND NOT reviews.issubmitted 
      AND NOT reviews.islecturerreview
    ) > 0
  `;
  const params = [homeworkId, courseId];
  return await databaseQuery(queryText, params);
};

/**
 * @param {string} reviewId
 * @param {string} userId
 * @param {boolean} isSuperuser
 */
export const selectReviewForUser = async (reviewId, userId, isSuperuser) => {
  const queryText = `
    SELECT 
        reviews.id
      , reviews.issubmitted
      , reviews.solutionid
      , homeworks.samplesolutionfilenames
      , solutions.homeworkid
      , homeworks.homeworkname
      , homeworks.reviewstart
      , homeworks.reviewend
      , homeworks.taskfilenames
      , homeworks.evaluationschemefilenames
      , solutions.solutionfilenames
      , solutions.solutioncomment
      , homeworks.evaluationvariant
      , homeworks.reviewallowedformats
      , homeworks.maxreachablepoints
    FROM reviews
    LEFT JOIN solutions on reviews.solutionid = solutions.id
    LEFT JOIN homeworks on solutions.homeworkid = homeworks.id
    LEFT JOIN attends ON (
      attends.courseid = homeworks.courseid AND 
      (attends.islecturer OR attends.ismodulecoordinator) AND 
      attends.userid = $2
    )
    LEFT JOIN users ON users.userid = $2
    WHERE reviews.id = $1
    AND users.isactive AND users.isemailverified
    AND (
      reviews.userid = $2 OR
      attends.userid = $2 OR
      $3
    )
  `;
  const params = [reviewId, userId, isSuperuser];
  return await databaseQuery(queryText, params);
};

/**
 * Updates the table reviews for a specific review and user with the parameters passed to the function below
 *
 * @param {string} reviewId
 * @param {string} userId
 * @param {number} percentageGrade
 * @param {object} reviewFiles
 * @param {string} reviewFileNames
 * @param {string} reviewComment
 */
export const updateReview = async (reviewId, userId, percentageGrade, reviewFiles, reviewFileNames, reviewComment) => {
  const queryText = `
    UPDATE reviews
    SET 
        issubmitted = TRUE
      , percentagegrade = $3
      , reviewfiles = $4
      , reviewfilenames = $5
      , submitdate = NOW()
      , reviewcomment = $6
    WHERE reviews.id = $1
    AND reviews.userid = $2
    AND NOT reviews.issubmitted
  `;

  const params = [reviewId, userId, percentageGrade, [reviewFiles], [reviewFileNames], reviewComment];
  return await databaseQuery(queryText, params);
};

export const selectHomeworkReviewAllowedFormatsForReviewAndUser = async (reviewId, userId) => {
  const queryText = `
    SELECT homeworks.reviewallowedformats
    FROM reviews
    JOIN solutions ON reviews.solutionid = solutions.id
    JOIN homeworks ON solutions.homeworkid = homeworks.id
    JOIN users ON users.userid = $2
    WHERE reviews.id = $1
    AND users.isactive AND users.isemailverified
    AND reviews.userid = $2
    AND NOT reviews.issubmitted
    AND homeworks.reviewstart <= NOW()
    AND homeworks.reviewend > NOW()
  `;

  const params = [reviewId, userId];
  const res = await databaseQuery(queryText, params);
  if (res.rows.length === 0) return null;
  return res.rows[0].reviewallowedformats;
};

export const selectReviewsForSolution = async (solutionId) => {
  const queryText = `SELECT *
    FROM reviews
    WHERE solutionid = $1
  `;
  const params = [solutionId];
  return await databaseQuery(queryText, params);
};
