import { selectSolutions } from '../../../services/api/database/solutions';
import { selectHomeworksForDistribution } from '../../../services/api/database/homework';
import { createReview } from '../../../services/api/database/review';

const distributeReviews = async () => {
  let userList = [];
  let solutionList = [];
  const homeworkQuery = await selectHomeworksForDistribution();

  /**
   */
  function shuffle() {
    let currentIndex = userList.length;
    let temporaryValue1;
    let temporaryValue2;
    let randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue1 = userList[currentIndex];
      temporaryValue2 = solutionList[currentIndex];
      userList[currentIndex] = userList[randomIndex];
      solutionList[currentIndex] = solutionList[randomIndex];
      userList[randomIndex] = temporaryValue1;
      solutionList[randomIndex] = temporaryValue2;
    }
  }

  for (let i = 0; i < homeworkQuery; i++) {
    const userQuery = await selectSolutions(homeworkQuery.rows[i].courseid);
    if (userQuery.rows.length <= 2) {
      throw new Error(`Nicht genügend Solutions vorhanden. Hausaufgabe: ${homeworkQuery.rows[i].id.toString}`);
    } else {
      for (let j = 0; j < userQuery.rows.length; j++) {
        userList.push(userQuery.rows[j].userid);
        solutionList.push(userQuery.rows[j].solutionid);
      }

      shuffle();

      await createReview(userList, solutionList, homeworkQuery.rows[i].correctingvariant, homeworkQuery.rows[i].id);

      // setting the arrays to new empty ones for the next run
      userList = [];
      solutionList = [];
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
