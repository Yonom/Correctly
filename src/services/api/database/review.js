import { databaseTransaction } from '.';

/**
 * text
 *
 * @param {varchar(64)} userList
 * @param {number} solutionList
 * @param {number} correctingVariant
 * @param {string} homeworkId
 */
export async function createReview(userList, solutionList, correctingVariant, homeworkId) {
  return databaseTransaction(async (client) => {
    const queryText1 = 'INSERT INTO reviews(userid, solutionid) VALUES($1, $2)';

    // Loop for all users in list with an index lower than length of list - correctingVariant
    for (let i = 0; i < userList.length - correctingVariant; i++) {
      for (let j = 1; j <= correctingVariant; j++) {
        const params1 = [userList[i], solutionList[i + j]];
        client.databaseQuery(queryText1, params1);
      }
    }

    // Loop for all users not covered by the previous loop. This splitting is necessary to avoid null-pointer-exceptions
    for (let i = userList.length - correctingVariant; i < userList.length; i++) {
      for (let j = 1; j <= correctingVariant; j++) {
        let id = i + j;
        if (id >= userList.length) {
          id -= userList.length;
        }
        const params1 = [userList[i], solutionList[id]];
        client.databaseQuery(queryText1, params1);
      }
    }

    // Upadting the homework
    const queryText2 = `UPDATE homeworks
    SET distributedReviews = 1
    WHERE id = $1`;
    const params2 = [homeworkId];
    client.databaseQuery(queryText2, params2);
  });
}
