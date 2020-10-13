import { databaseQuery, databaseTransaction } from '.';

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
