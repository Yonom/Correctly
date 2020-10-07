import { selectSolutions } from '../../../services/api/database/solutions';
import { selectHomeworksForDistributionOfReviews } from '../../../services/api/database/homework';
import { createReviews, selectUsersWithoutReview } from '../../../services/api/database/review';
import { createAudits } from '../../../services/api/database/audits';

/**
 * @param {object[]} usersList
 */
function shuffle(usersList) {
  const res = [...usersList];
  let currentIndex = res.length;
  let temporaryValue1;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue1 = res[currentIndex];
    res[currentIndex] = res[randomIndex];
    res[randomIndex] = temporaryValue1;
  }
  return res;
}

const distributeReviews = async () => {
  const homeworkQuery = await selectHomeworksForDistributionOfReviews();

  for (const homework of homeworkQuery.rows) {
    const solutionQuery = await selectSolutions(homework.id);
    if (solutionQuery.rows.length <= 2) {
      // do not distribute, but mark the homework as distributed
      // audits will be created afterwards by the distribution of audits algorithm
      await createReviews([], homework.correctionvariant, homework.id);
    } else {
      const solutionsList = shuffle(solutionQuery.rows);
      await createReviews(solutionsList, homework.correctionvariant, homework.id);
    }
  }
};

const distributeAudits = async () => {
  const homeworkQuery = await selectHomeworksForDistributionOfReviews();

  for (const homework of homeworkQuery.rows) {
    const notDoneUsersQuery = await selectUsersWithoutReview(homework.id, homework.courseid);
    const notDoneUsers = notDoneUsersQuery.rows;

    // TODO analog zu distributeReviews umsetzen
    await createAudits('TODO', notDoneUsers, homework.id);
  }
};

const distribution = async (req, res) => {
  await distributeReviews();
  await distributeAudits();
  return res.json({ });
};

export default distribution;
