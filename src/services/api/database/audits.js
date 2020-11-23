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
 * @param {object[]} auditList
 * @param {object[]} notDoneUserList
 * @param {string} homeworkId
 */
export async function createAudits(auditList, notDoneUserList, homeworkId) {
  return databaseTransaction(async (client) => {
    const queryText0 = 'SELECT hasdistributedaudits FROM homeworks WHERE id = $1 FOR UPDATE';
    const params0 = [homeworkId];
    const result = await client.query(queryText0, params0);
    if (result.rowCount === 0 || result.rows[0].hasdistributedaudits) {
      return; // already distributed
    }

    await createSystemReviews(client, notDoneUserList, homeworkId);

    // todo: create audits for reviews in reviewList
    const queryText = 'INSERT INTO audits(solutionid, reason, isresolved) VALUES($1, $2, false)';
    for (const { solutionId, reason } of auditList) {
      const params = [solutionId, reason];
      await client.query(queryText, params);
    }

    // Upadting the homework
    const queryText2 = `UPDATE homeworks
    SET hasdistributedaudits = true
    WHERE id = $1`;
    const params2 = [homeworkId];
    await client.query(queryText2, params2);
  });
}
