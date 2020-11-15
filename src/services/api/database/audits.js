import { databaseQuery, databaseTransaction } from '.';
import { AUDIT_BY_LECTURERS, AUDIT_BY_MODULE_COORDINATOR } from '../../../utils/constants';

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

/**
 * @param solutionId
 * @param comment
 */
export async function createPlagiarismAudits(solutionId) {
  const plagiarismQueryText = `
  INSERT INTO audits(solutionid, reason)
  VALUES($1,$2);
  `;
  const reason = 'plagiarism';
  await databaseQuery(plagiarismQueryText, [solutionId, reason]);
  // const solutionmodeQueryText = `
  //   SELECT homeworks.auditors
  //   FROM solutions
  //   JOIN homeworks on homeworks.id = solutions.homeworkid
  //   WHERE solutions.id = $1
  // `;
  // const solutionMode = await databaseQuery(solutionmodeQueryText, [solutionId]);

  // switch (solutionMode.rows[0].auditors) {
  //   case AUDIT_BY_LECTURERS: {
  //     console.log('Audit by lecturers');
  //     break;
  //   }
  //   case AUDIT_BY_MODULE_COORDINATOR: {
  //     console.log('Audit by MODULE_COORDINATOR');
  //     break;
  //   }
  //   default:
  //     return Error({ message: 'plagiarism/unkonwn-audit-mode' });
  // }
}

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
    const queryText2 = `UPDATE homeworks
    SET hasdistributedaudits = true
    WHERE id = $1`;
    const params2 = [homeworkId];
    await client.query(queryText2, params2);
  });
}
