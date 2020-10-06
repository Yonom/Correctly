import { databaseTransaction } from '.';

const createParamsForDistributedHomeworks = (solutionList, correctingVariant) => {
  // convert correctingVariant into Integer
  let correctors;
  if (correctingVariant === 'correct-one') {
    correctors = 1;
  } else if (correctingVariant === 'correct-two') {
    correctors = 2;
  } else {
    throw new Error(`too many correctors (${correctingVariant}) in Homework`);
  }

  const params = [];
  // Loop for all users in list with an index lower than length of list - correctingVariant
  for (let i = 0; i < solutionList.length - correctors; i++) {
    for (let j = 1; j <= correctors; j++) {
      params.push([solutionList[i].userid, solutionList[i + j].solutionid]);
    }
  }

  // Loop for all users not covered by the previous loop. This splitting is necessary to avoid null-pointer-exceptions
  for (let i = solutionList.length - correctors; i < solutionList.length; i++) {
    for (let j = 1; j <= correctors; j++) {
      let id = i + j;
      if (id >= solutionList.length) {
        id -= solutionList.length;
      }
      params.push([solutionList[i].userid, solutionList[id].solutionid]);
    }
  }
};

/**
 * text
 *
 * @param {string[]} solutionList
 * @param {string[]} notDoneUserList
 * @param {string} correctingVariant
 * @param {string} homeworkId
 */
export async function createReview(solutionList, notDoneUserList, correctingVariant, homeworkId) {
  return databaseTransaction(async (client) => {
    const queryText1 = 'INSERT INTO reviews(userid, solutionid, issystemreview) VALUES($1, $2, $3)';
    const params1Collection = createParamsForDistributedHomeworks(solutionList, correctingVariant);
    for (const params1 of params1Collection) {
      await client.query(queryText1, params1);
    }

    // Upadting the homework
    const queryText3 = `UPDATE homeworks
    SET distributedReviews = 1
    WHERE id = $1`;
    const params3 = [homeworkId];
    await client.databaseQuery(queryText3, params3);
  });
}
