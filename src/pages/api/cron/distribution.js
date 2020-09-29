import { selectSolutions } from '../../../services/api/database/solutions';
import { selectHomeworksForReview } from '../../../services/api/database/homework';
import { createReview } from '../../../services/api/database/review';

const test = async (req, res) => {
  const userList = [];
  const solutionList = [];
  const problemList = [];
  const homeworkQuery = await selectHomeworksForReview();
  if (homeworkQuery.rows.length === 0) {
    return res.status(404).json({ code: 'no-homework-for-review' });
  }

  /**
   */
  function shuffle() {
    /*
     * userList und solutionList müssen durchgemischt werden
     * Achte darauf, dass beide Listen genau gleich gemischt werden
     * Das heißt, dass wenn du z.B. den Wert aus userList[0] and die Stelle von userList[3] setzt,
     * dass der Wert aus solutionList[0] dann auch an die Stelle von solutionList[3] gesetzt wird.
     *
     * Diesen Kommentar kannst du Löschen, wenn du mit deiner Arbeit fertig bist
     */
  }

  for (let i = 0; i < homeworkQuery; i++) {
    const userQuery = await selectSolutions(homeworkQuery.rows[i].courseid);
    if (userQuery.rows.length <= 2) {
      problemList.push(`Nicht genügend Solutions vorhanden. Hausaufgabe: ${homeworkQuery.rows[i].id.toString}`);
    } else {
      for (let j = 0; j < userQuery.rows.length; j++) {
        userList.push(userQuery.rows[j].userid);
        solutionList.push(userQuery.rows[j].solutionid);
      }

      shuffle();

      await createReview(userList, solutionList, homeworkQuery.rows[i].correctingvariant, homeworkQuery.rows[i].id);
    }
  }

  return res.json({ problems: problemList });
};

export default test;
