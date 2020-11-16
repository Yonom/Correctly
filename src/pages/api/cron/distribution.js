import { selectSolutions } from '../../../services/api/database/solutions';
import { selectHomeworksForDistributionOfAudits, selectHomeworksForDistributionOfReviews } from '../../../services/api/database/homework';
import { createReviews, selectReviewsForSolution, selectUsersWithoutReview } from '../../../services/api/database/review';
import { createAudits } from '../../../services/api/database/audits';
import { POINTS, ZERO_TO_ONE_HUNDRED } from '../../../utils/constants';

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
    const { threshold } = homework.threshold; // <- Hier samplesize definieren
    const { maxReachablePoints } = homework.maxreachablepoints; // <- Max reachable points
    const { reviewerCount } = homework.reviewercount;

    const alpha = threshold / 100;

    const reviewAudit = [];
    const reasonList = [];

    // Wenn 2 Bewerter werden die reviews auf threshold geprüft -> Variante B wichtig has made effort?
    if (reviewerCount === 'correct-two') {
      for (const solution of solutionQuery.rows) {
        const grades = [];
        const reviewQuery = await selectReviewsForSolution(solution.id);
        for (const review of reviewQuery.rows) {
          if (review.percentagegrade) {
            grades.push(review.percentagegrade);
          }
        }

        // Grades können Nominal/ prozentual / absolut sein

        if (grades.length === 2) {
          if (homework.evaluationvariant === ZERO_TO_ONE_HUNDRED || POINTS) {
            // Zahlen threshold
            const spanGrades = Math.abs(grades[0] - grades[1]);
            const delta = spanGrades / maxReachablePoints;

            if (delta >= alpha) {
              reviewAudit.push(solution.id);
              reasonList.push('threshold');
            }
          } else if (grades[0] !== grades[1]) {
            // nominaler threshold
            reviewAudit.push(solution.id);
            reasonList.push('threshold');
          }
        } else {
          reviewAudit.push(solution.id);
          reasonList.push('Missing Review(s)');
        }
      }
    } else if (reviewerCount === 'correct-one') {
      for (const solution of solutionQuery.rows) {
        const reviewQuery = await selectReviewsForSolution(solution.id);
        if (reviewQuery.length !== 1) {
          reviewAudit.push(solution.id);
          reasonList.push('Incorrect Number of Reviews');
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
        reasonList.push('Random');
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
