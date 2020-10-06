import { selectSolutions, selectUsersWithoutSolution } from '../../../services/api/database/solutions';
import { selectHomeworksForDistribution } from '../../../services/api/database/homework';
import { createReview } from '../../../services/api/database/review';

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
  const homeworkQuery = await selectHomeworksForDistribution();

  for (const homework of homeworkQuery.rows) {
    const solutionQuery = await selectSolutions(homework.id);
    const notDoneUsersQuery = await selectUsersWithoutSolution(homework.id, homework.courseid);
    const notDoneUsers = notDoneUsersQuery.rows;
    if (solutionQuery.rows.length <= 2) {
      // do not distribute, but mark the homework as distributed
      // audits will be created afterwards by the distribution of audits algorithm
      await createReview([], notDoneUsers, homework);
    } else {
      const solutionsList = shuffle(solutionQuery.rows);
      await createReview(solutionsList, notDoneUsers, homework);
    }
  }
};

const distribution = async (req, res) => {
  try {
    await distributeReviews();
    return res.json({ });
  } catch (ex) {
    return res.status(500).json(ex);
  }
};

export default distribution;
