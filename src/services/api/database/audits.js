import { databaseTransaction } from '.';
import { createSystemReviews } from './review';

/**
 * @param {object[]} reviewList
 * @param {object[]} notDoneUserList
 * @param {string} correctingVariant
 * @param {number} threshold
 * @param {number} samplesize
 * @param {string} homeworkId
 */
export async function createAudits(reviewList, notDoneUserList, correctingVariant, threshold, samplesize, homeworkId) {
  return databaseTransaction(async (client) => {
    await createSystemReviews(client, notDoneUserList);

    // Upadting the homework
    const queryText2 = `UPDATE homeworks
    SET hasdistributedaudits = true
    WHERE id = $1`;
    const params2 = [homeworkId];
    await client.databaseQuery(queryText2, params2);
  });
}
