import { databaseQuery, databaseTransaction } from '.';
import { AUDIT_REASON_MISSING_REVIEW_SUBMISSION, ONE_REVIEWER, TWO_REVIEWERS } from '../../../utils/constants';

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
 * checks, whether a user is allowed to create a new LecturerReview for a given solution.
 *
 * @param {string} solutionId the solutionId for which the right should be checked
 * @param {string} userId the userId for which the right should be checked
 * @returns {boolean} true if user has right to create a LecturerReview, false if otherwise
 */
export async function hasLecturerReviewRightsForSolutionId(solutionId, userId) {
  const queryText = `
  SELECT 
    count(solutions.id)>0
  FROM solutions
  LEFT JOIN homeworks on solutions.homeworkid = homeworks.id
  LEFT JOIN attends ON (
    attends.courseid = homeworks.courseid AND 
    (attends.islecturer OR attends.ismodulecoordinator) AND 
    attends.userid = $2
  )
  LEFT JOIN users ON users.userid = attends.userid
  WHERE solutions.id = $1
    AND users.isactive AND users.isemailverified
    AND attends.userid = $2
  `;
  const params = [solutionId, userId];
  return await databaseQuery(queryText, params);
}

/**
 * creates a new LecturerReview for a given solutin if at least one of the following
 * conditions applies:
 *    - is Lecturer for the corresponding course of the solution
 *    - is Module Coordinator for the corresponding course of the solution
 *    - is Superuser
 *
 * @param {string} userId the userId of the reviewer
 * @param {string} solutionId the solutionId for which a LecturerReview should be created
 * @param {boolean} isSuperuser whether the reviewer is a superuser
 * @returns {string} the reviewId for the created LecturerReview, null if user not authorised
 */
export async function createLecturerReview(userId, solutionId, isSuperuser) {
  if (isSuperuser || await hasLecturerReviewRightsForSolutionId(solutionId, userId)) {
    const queryText = `
    INSERT INTO reviews(solutionid, userid, islecturerreview, isvisible)
    VALUES($1, $2, true, false) RETURNING id
    `;
    const params = [solutionId, userId];
    return await databaseQuery(queryText, params);
  }
  return null;
}

/**
 * @param {object[]} solutionList
 * @param {object[]} auditList
 * @param {string} reviewerCount
 * @param {string} homeworkId
 */
export async function createReviews(solutionList, auditList, reviewerCount, homeworkId) {
  return databaseTransaction(async (client) => {
    const queryText0 = 'SELECT hasdistributedreviews FROM homeworks WHERE id = $1 FOR UPDATE';
    const params0 = [homeworkId];
    const result = await client.query(queryText0, params0);
    if (result.rowCount === 0 || result.rows[0].hasdistributedreviews) {
      return; // already distributed
    }

    const queryText1 = 'INSERT INTO reviews(userid, solutionid) VALUES($1, $2)';
    const params1Collection = createParamsForDistributedHomeworks(solutionList, reviewerCount);
    for (const params1 of params1Collection) {
      await client.query(queryText1, params1);
    }

    const queryText2 = 'INSERT INTO audits(solutionid, reason, isresolved) VALUES($1, $2, false)  ON CONFLICT (solutionid) DO UPDATE SET reason = $2, isresolved = false';
    for (const { id } of auditList) {
      await client.query(queryText2, [id, AUDIT_REASON_MISSING_REVIEW_SUBMISSION]);
    }

    // Updating the homework
    const queryText3 = `UPDATE homeworks
    SET hasdistributedreviews = true
    WHERE id = $1`;
    const params3 = [homeworkId];
    await client.query(queryText3, params3);
  });
}

/**
 * @param {string} homeworkId
 */
export const selectUsersWithoutReview = async (homeworkId) => {
  const queryText = `
    SELECT reviews.userid, array_agg(solutions.userid) as victims
    FROM reviews
    LEFT JOIN solutions ON solutions.id = reviews.solutionid
    WHERE solutions.homeworkid = $1 
    AND NOT reviews.issubmitted 
    AND NOT reviews.islecturerreview
    GROUP BY reviews.userid
    HAVING COUNT(solutions.id) > 0
  `;
  const params = [homeworkId];
  return await databaseQuery(queryText, params);
};

/**
 * @param {string} reviewId
 * @param {string} userId
 * @param {boolean} isSuperuser
 */
export const selectReviewForReviewer = async (reviewId, userId, isSuperuser) => {
  const queryText = `
    SELECT 
        reviews.id
      , reviews.issubmitted
      , reviews.solutionid
      , reviews.islecturerreview
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
    LEFT JOIN users ON users.userid = $2
    WHERE reviews.id = $1
    AND (reviews.userid = $2 OR $3)
    AND users.isactive AND users.isemailverified
    AND reviews.issubmitted = false
    AND (
      reviews.islecturerreview 
      OR (
        homeworks.reviewend > NOW() 
        AND homeworks.reviewstart <= NOW()
      )
    )
  `;
  const params = [reviewId, userId, isSuperuser];
  return await databaseQuery(queryText, params);
};

/**
 * @param {string} reviewId
 * @param {string} userId
 * @param {boolean} isSuperuser
 */
export const selectReviewForUserToShow = async (reviewId, userId, isSuperuser) => {
  const queryText = `
    SELECT 
        reviews.id
      , reviews.userid
      , (SELECT (u.lastname) FROM users AS u WHERE u.userid = reviews.userid) AS reviewerln
      , (SELECT (u.firstname) FROM users AS u WHERE u.userid = reviews.userid) AS reviewerfn
      , reviews.percentagegrade
      , reviews.reviewfilenames
      , reviews.reviewcomment
      , homeworks.reviewallowedformats
      , (SELECT (u.lastname) FROM users AS u WHERE u.userid = solutions.userid) AS studentreviewedln
      , (SELECT (u.firstname) FROM users AS u WHERE u.userid = solutions.userid) AS studentreviewedfn
      , homeworks.homeworkname
      , reviews.issubmitted
      , homeworks.evaluationvariant
      , homeworks.maxreachablepoints
      , reviews.issystemreview
    FROM reviews
    LEFT JOIN solutions on reviews.solutionid = solutions.id
    LEFT JOIN homeworks on solutions.homeworkid = homeworks.id
    LEFT JOIN attends AS myattends ON (
      myattends.courseid = homeworks.courseid AND 
      myattends.userid = $2
    )
    LEFT JOIN users ON users.userid = $2
    WHERE reviews.id = $1
    AND users.isactive AND users.isemailverified
    AND (
      myattends.islecturer OR myattends.ismodulecoordinator OR $3
    )
  `;
  const params = [reviewId, userId, isSuperuser];
  return await databaseQuery(queryText, params);
};

/**
 * Selects the files attached to a specific review for a specific user
 *
 * @param {string} reviewId The id of the review
 * @param {string} userId The id of the user
 * @param {boolean} isSuperuser whether the user is a superuser (true) or not (false)
 */
export const selectReviewFileForUser = async (reviewId, userId, isSuperuser) => {
  const queryText = `
    SELECT 
        reviews.reviewfiles
      , reviews.reviewfilenames
    FROM reviews
    LEFT JOIN users ON users.userid = $2
    WHERE 
      reviews.id = $1 AND
      users.isactive AND 
      users.isemailverified AND
      ( 
        reviews.userid = $2 OR
        $3 
      )
  `;
  const params = [reviewId, userId, isSuperuser];
  return await databaseQuery(queryText, params);
};

/**
 * @param {string} solutionId
 * @param {string} userId
 * @param {boolean} isSuperuser
 */
export const selectAllReviewsForSolution = async (solutionId, userId, isSuperuser) => {
  const queryText = `
    SELECT
      reviews.id as reviewId,
      reviews.islecturerreview,
      reviews.issystemreview,
      reviews.issubmitted,
      reviews.percentagegrade,
      reviews.reviewcomment,
      reviews.reviewfilenames,
      reviews.reviewfiles,
      reviews.solutionid,
      reviews.submitdate,
      reviewers.userid as revieweruserid,
      reviewers.studentid as reviewerstudentid
    from reviews
    LEFT JOIN solutions on reviews.solutionid = solutions.id
    LEFT JOIN homeworks on solutions.homeworkid = homeworks.id
    LEFT JOIN attends ON (
      attends.courseid = homeworks.courseid AND 
      (attends.islecturer OR attends.ismodulecoordinator) AND 
      attends.userid = $2
    )
    LEFT JOIN users as reviewers on reviewers.userid = reviews.userid
    LEFT JOIN users on users.userid = solutions.userid
    where reviews.solutionid = $1 
    AND (reviews.issubmitted OR reviews.isvisible)
    AND users.isactive AND users.isemailverified
    AND (
      attends.userid = $2 OR
      $3
    )
  `;
  const params = [solutionId, userId, isSuperuser];
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
    RETURNING reviews.islecturerreview, reviews.solutionid
  `;

  const params = [reviewId, userId, percentageGrade, [reviewFiles], [reviewFileNames], reviewComment];
  return await databaseQuery(queryText, params);
};

export const selectHomeworkReviewAllowedFormatsForReviewAndUser = async (reviewId, userId, isSuperuser) => {
  const queryText = `
    SELECT homeworks.reviewallowedformats
    FROM reviews
    JOIN solutions ON reviews.solutionid = solutions.id
    JOIN homeworks ON solutions.homeworkid = homeworks.id
    JOIN users ON users.userid = $2
    WHERE reviews.id = $1
    AND (reviews.userid = $2 OR $3)
    AND users.isactive AND users.isemailverified
    AND reviews.issubmitted = false
    AND (
      reviews.islecturerreview 
      OR (
        homeworks.reviewend > NOW() 
        AND homeworks.reviewstart <= NOW()
      )
    )
  `;

  const params = [reviewId, userId, isSuperuser];
  const res = await databaseQuery(queryText, params);
  if (res.rows.length === 0) return null;
  return res.rows[0].reviewallowedformats;
};

export const selectReviewsForSolution = async (solutionId) => {
  const queryText = `SELECT *
    FROM reviews
    WHERE solutionid = $1 AND NOT islecturerreview AND NOT issystemreview
  `;
  const params = [solutionId];
  return await databaseQuery(queryText, params);
};
