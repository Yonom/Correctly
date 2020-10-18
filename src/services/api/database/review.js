import { databaseQuery, databaseTransaction } from '.';
import { ONE_REVIEWER, TWO_REVIEWERS } from '../../../utils/constants';

const createParamsForDistributedHomeworks = (solutionList, correctingVariant) => {
  // convert correctingVariant into Integer
  let correctors;
  if (correctingVariant === ONE_REVIEWER) {
    correctors = 1;
  } else if (correctingVariant === TWO_REVIEWERS) {
    correctors = 2;
  } else {
    throw new Error(`too many correctors (${correctingVariant}) in Homework`);
  }

  const params = [];
  const shiftedList = [...solutionList];
  for (let j = 1; j <= correctors; j++) {
    shiftedList.push(shiftedList.shift());
    params.push(...solutionList.map(({ userid }, i) => {
      return [userid, shiftedList[i].id];
    }));
  }

  return params;
};

/**
 * @param {object[]} solutionList
 * @param {string} correctingVariant
 * @param {string} homeworkId
 */
export async function createReviews(solutionList, correctingVariant, homeworkId) {
  return databaseTransaction(async (client) => {
    const queryText1 = 'INSERT INTO reviews(userid, solutionid) VALUES($1, $2)';
    const params1Collection = createParamsForDistributedHomeworks(solutionList, correctingVariant);
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
      WHERE reviews.userid = attends.userid AND solutions.homeworkid = $1 AND NOT issubmitted AND NOT islecturerreview
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
      , homeworks.modelsolutionname
      , solutions.homeworkid
      , homeworks.homeworkname
      , homeworks.correctingstart
      , homeworks.correctingend
      , homeworks.exerciseassignmentname
      , homeworks.evaluationschemename
      , solutions.solutionfilename
      , solutions.solutioncomment
      , homeworks.evaluationvariant
      , homeworks.correctionallowedformats
      , homeworks.maxreachablepoints
    FROM reviews
    LEFT JOIN solutions on reviews.solutionid = solutions.id
    LEFT JOIN homeworks on solutions.homeworkid = homeworks.id
    LEFT JOIN attends ON (
      attends.courseid = homeworks.courseid AND 
      (attends.islecturer OR attends.ismodulecoordinator) AND 
      attends.userid = $2
    )
    WHERE reviews.id = $1
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
 * @param {object} documentationFile
 * @param {string} documentationFileName
 * @param {string} documentationComment
 */
export const updateReview = async (reviewId, userId, percentageGrade, documentationFile, documentationFileName, documentationComment) => {
  const queryText = `
    UPDATE reviews
    SET 
        issubmitted = TRUE
      , percentagegrade = $3
      , documentation = $4
      , documentationfilename = $5
      , submitdate = NOW()
      , documentationcomment = $6
    WHERE id = $1 
    AND userid = $2
    AND NOT issubmitted
  `;

  const params = [reviewId, userId, percentageGrade, [documentationFile], [documentationFileName], documentationComment];
  return await databaseQuery(queryText, params);
};
