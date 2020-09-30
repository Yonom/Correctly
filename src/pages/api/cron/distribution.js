import { selectSolutions } from '../../../services/api/database/solutions';
import { selectHomeworksForReview } from '../../../services/api/database/homework';
import { createReview } from '../../../services/api/database/review';

const test = async (req, res) => {
  const userList = [];
  const solutionList = [];
  const eventList = [];
  const homeworkQuery = await selectHomeworksForReview();
  if (homeworkQuery.rows.length === 0) {
    return res.status(404).json({ code: 'no-homework-for-review' });
  }
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

    eventList.push(userList, solutionList);
  }

  for (let i = 0; i < homeworkQuery; i++) {
    const userQuery = await selectSolutions(homeworkQuery.rows[i].courseid);
    if (userQuery.rows.length <= 2) {
      eventList.push(`Nicht genügend Solutions vorhanden. Hausaufgabe: ${homeworkQuery.rows[i].id.toString}`);
    } else {
      for (let j = 0; j < userQuery.rows.length; j++) {
        userList.push(userQuery.rows[j].userid);
        solutionList.push(userQuery.rows[j].solutionid);
      }

      shuffle();

      eventList.push(await createReview(userList, solutionList, homeworkQuery.rows[i].correctingvariant, homeworkQuery.rows[i].id));
    }
  }

  return res.json({ events: eventList });
};

export default test;
