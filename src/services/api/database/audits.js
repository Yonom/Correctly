import { databaseTransaction } from '.';

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
      SELECT solutionid
      FROM solutions
      WHERE userid = $1 AND homeworkid = $2
    ), true, true, 0)
  `;

  const paramsCollection = createParamsForNotDoneReviews(notDoneUserList, homeworkId);
  for (const params of paramsCollection) {
    await client.query(queryText, params);
  }
}

/**
 * @param {object[]} reviewList
 * @param {object[]} notDoneUserList
 * @param {string} homeworkId
 */
export async function createAudits(reviewList, notDoneUserList, homeworkId) {
  return databaseTransaction(async (client) => {
    await createSystemReviews(client, notDoneUserList);

    // todo: create audits for reviews in reviewList

    // Upadting the homework
    const queryText2 = `UPDATE homeworks
    SET hasdistributedaudits = true
    WHERE id = $1`;
    const params2 = [homeworkId];
    await client.query(queryText2, params2);
  });
}
