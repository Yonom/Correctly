import { databaseQuery, databaseTransaction } from '.';

const createParamsForNotDoneReviews = (userList, homeworkId) => {
  return userList.map(({ userid }) => [userid, homeworkId]);
};

/**
 * @param {import('pg').PoolClient} client
 * @param {string[]} notDoneUserList
 * @param {number} homeworkId
 */
export async function createSystemReviews(client, notDoneUserList, homeworkId) {
  const queryText = `
    INSERT INTO reviews(userid, solutionid, issystemreview, issubmitted, percentagegrade) VALUES($1, (
      SELECT id
      FROM solutions
      WHERE userid = $1 AND homeworkid = $2
    ), true, true, 0)
  `;

  const paramsCollection = createParamsForNotDoneReviews(notDoneUserList, homeworkId);
  for (const params of paramsCollection) {
    await client.query(queryText, params);
  }
}

export const selectOpenAuditsForSolution = async (userId, solutionid) => {
  const queryText = `
  SELECT COUNT(audits.solutionid)>0 as hasaudit
  FROM audits
  JOIN solutions ON audits.solutionid = solutions.id
    AND audits.solutionid = $2
  JOIN homeworks ON solutions.homeworkid = homeworks.id 
  JOIN courses ON homeworks.courseid = courses.id
  JOIN users ON solutions.userid = users.userid
  WHERE isresolved = false and courses.id IN (
    SELECT courseid 
    FROM attends
    INNER JOIN users ON users.userid = attends.userid 
    WHERE users.userid = $1
      AND isactive
      AND isemailverified
      AND (
      (islecturer AND homeworks.auditors = 'lecturers') OR 
      (ismodulecoordinator AND homeworks.auditors = 'coordinator')
    )
  )
  `;
  const params = [userId, solutionid];
  return await databaseQuery(queryText, params);
};

export const resolveAudit = async (userId, solutionid) => {
  const queryText = `
  UPDATE audits
  SET isresolved = true, resolvedby = $1, resolveddate = NOW()
  WHERE solutionid = $2
  `;
  const params = [userId, solutionid];
  return await databaseQuery(queryText, params);
};

/**
 * @param {object[]} reviewList
 * @param {object[]} notDoneUserList
 * @param {string} homeworkId
 */
export async function createAudits(reviewList, notDoneUserList, homeworkId) {
  return databaseTransaction(async (client) => {
    await createSystemReviews(client, notDoneUserList, homeworkId);

    // todo: create audits for reviews in reviewList

    // Upadting the homework
    const queryText2 = `
    UPDATE audits
    SET isresolved = true, resolvedby = $2, resolveddate = NOW()
    WHERE solutionid = $1
    `;
    const params2 = [homeworkId];
    await client.query(queryText2, params2);
  });
}
