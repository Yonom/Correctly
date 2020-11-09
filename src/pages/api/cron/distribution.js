import { selectSolutions } from '../../../services/api/database/solutions';
import { selectHomeworksForDistributionOfAudits, selectHomeworksForDistributionOfReviews } from '../../../services/api/database/homework';
import { createReviews, selectReviewsForSolution, selectUsersWithoutReview } from '../../../services/api/database/review';
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

/**
 * @param homeworkId
 */
function loadReviews(homeworkId) {
  const reviewQuery = await selectReviewForHomework();// <- Muss noch implementiert werden (ID, SolutionId, Grade)
  //sortieren nach SolutionId
  return reviewQuery;
}

function getReviewGrades(solutionId, reviewerCount, reviewQuery){
  let reviewQueryEdit = reviewQuery;
  let grades = [];
  let i = 0;
  while(grades.length<reviewerCount && i < reviewQueryEdit.length+1){
    if(reviewQueryEdit[i].SolutionId === solutionId){
    grades.push(reviewQuery[i].grade);
    reviewQueryEdit.pop(reviewQueryEdit[i]); // Wer aus ReviewQuery löschen
    i = 0;
    }else if(i===reviewQueryEdit){
      //ggf. solution filtern, die keine x reviews hat ggf. anders lösen
      i++;
    }
    else{
      i++;
    }
  }
  const answer = [grades, reviewQueryEdit]
  return answer;

}

const distributeReviews = async () => {
  const homeworkQuery = await selectHomeworksForDistributionOfReviews();

  for (const homework of homeworkQuery.rows) {
    const solutionQuery = await selectSolutions(homework.id);
    if (solutionQuery.rows.length <= 2) {
      // do not distribute, but mark the homework as distributed
      // audits will be created afterwards by the distribution of audits algorithm
      await createReviews([], homework.reviewercount, homework.id);
    } else {
      const solutionsList = shuffle(solutionQuery.rows);
      await createReviews(solutionsList, homework.reviewercount, homework.id);
    }
  }
};

const distributeAudits = async () => {
  const homeworkQuery = await selectHomeworksForDistributionOfAudits();

  for (const homework of homeworkQuery.rows) {
    const notDoneUsersQuery = await selectUsersWithoutReview(homework.id, homework.courseid);
    const notDoneUsers = notDoneUsersQuery.rows;

    const solutionQuery = await selectSolutions(homework.id);
    const { sampleSize } = homework.samplesize; // <- Hier samplesize definieren
    const { treshold } = homework.treshold; // <- Hier samplesize definieren
    const { maxReachablePoints } = homework.maxreachablepoints; // <- Max reachable points
    const { reviewerCount } = homework.reviewercount;

    const alpha = treshold / 100;

    const reviewAudit = [];
    const reasonList = [];

    // Wenn ein Treshholdwert nicht null existiert werden die reviews geprüft -> Variante B
    if (!alpha === 0 && reviewerCount > 1) {
      for (const solution of solutionQuery.rows) {
        const grades = [];
        const reviewQuery = await selectReviewsForSolution(solution.id);

        for (const review of reviewQuery.rows) {
          grades.push(review.percentagegrade);
        }
        /*
        * Kommentar an Carl: Bedenke, dass "grades" leer sein wird, wenn alle User, die für die Bewertung einer Solution eingeteilt worden sind, keine Reviews abgegeben haben
        * Decke diesen Fall in deiner Ablaufsteuerung bitte auch ab
        */

        // grades sortieren von groß nach klein
        grades.sort((a, b) => b - a);
        
        const spanGrades = grades[0] - grades[grades.length-1];

        const delta = spanGrades / maxReachablePoints;

        if (delta >= alpha) {
          reviewAudit.push(solution.id);
          reasonList.push('Treshold');
        }
      }
    }

    // zufälliges hinzufügen von x Werten (einmalig) zur ReviewAuditIndexlist
    for (let i = 0; i < sampleSize; i++) {
      const number = Math.round(Math.floor(Math.random() * solutionQuery.length));
      if (reviewAudit.includes(solutionQuery[number].id)) {
        i -= 1;
      } else {
        reviewAudit.push(solutionQuery[number].id);
        reasonList.push('Sample');
      }
    }

    await createAudits(reviewAudit, reasonList, notDoneUsers, homework.id);
  }
};

const distributionCronAPI = async (req, res) => {
  await distributeReviews();
  await distributeAudits();
  return res.json({ });
};

export default distributionCronAPI;
