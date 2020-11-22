import { selectSolutions } from '../../../services/api/database/solutions';
import { selectHomeworksForDistributionOfAudits, selectHomeworksForDistributionOfReviews } from '../../../services/api/database/homework';
import { createReviews, selectReviewsForSolution, selectUsersWithoutReview } from '../../../services/api/database/review';
import { createAudits } from '../../../services/api/database/audits';
import { POINTS, ZERO_TO_ONE_HUNDRED, TWO_REVIEWERS, THRESHOLD_NA, AUDIT_REASON_DID_NOT_SUBMIT_REVIEW, AUDIT_REASON_MISSING_REVIEW_SUBMISSION, AUDIT_REASON_THRESHOLD, AUDIT_REASON_SAMPLESIZE } from '../../../utils/constants';
import withSentry from '../../../utils/api/withSentry';

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
      await createReviews([], solutionQuery.rows, homework.reviewercount, homework.id);
    } else {
      const solutionsList = shuffle(solutionQuery.rows);
      await createReviews(solutionsList, [], homework.reviewercount, homework.id);
    }
  }
};

const distributeAudits = async () => {
  const homeworkQuery = await selectHomeworksForDistributionOfAudits();

  for (const homework of homeworkQuery.rows) {
    const notDoneUsersQuery = await selectUsersWithoutReview(homework.id, homework.courseid);
    const solutionQuery = await selectSolutions(homework.id);
    const { samplesize } = homework; // <- Hier samplesize definieren
    const { threshold } = homework; // <- Hier samplesize definieren
    const reviewerCount = homework.reviewercount;
    const notDoneUsers = notDoneUsersQuery.rows;

    let alpha;

    if (threshold && threshold !== THRESHOLD_NA) {
      alpha = threshold / 100;
    }

    const reviewAudit = [];
    const reasonList = [];
    const notStudentReview = [];

    // Rausfiltern der Missing reviews, not done users und NotStudentReviews
    for (const solution of solutionQuery.rows) {
      const reviewQuery = await selectReviewsForSolution(solution.id);
      if (notDoneUsers.includes(solution.userid)) {
        reviewAudit.push(solution.id);
        reasonList.push(AUDIT_REASON_DID_NOT_SUBMIT_REVIEW);
      }
      for (const review of reviewQuery.rows) {
        if (!review.issubmitted) {
          reviewAudit.push(solution.id);
          reasonList.push(AUDIT_REASON_MISSING_REVIEW_SUBMISSION);
        }
        if (review.islecturerereview || review.issystemreview) {
          notStudentReview.push(solution.id);
        }
      }
    }

    // Wenn 2 Bewerter werden die reviews auf threshold geprüft falls dieser nicht N/A
    if (reviewerCount === TWO_REVIEWERS && threshold !== THRESHOLD_NA) {
      for (const solution of solutionQuery.rows) {
        // Prüfen ob solution nicht bereits im Audit ist (MISSING Review/ NOT SUbmittet) oder EInen Lecturerreview enthält
        if (!reviewAudit.includes(solution.id) && !notStudentReview.includes(solution.id)) {
          const reviewQuery = await selectReviewsForSolution(solution.id);
          const { grades } = reviewQuery.rows;
          if (homework.evaluationvariant === ZERO_TO_ONE_HUNDRED || POINTS) {
            // Zahlen threshold
            const delta = Math.abs(grades[0] - grades[1]) / 100;

            if (delta >= alpha) {
              reviewAudit.push(solution.id);
              reasonList.push(AUDIT_REASON_THRESHOLD);
            }
          } else if (grades[0] !== grades[1]) {
            // Nominaler threshold
            reviewAudit.push(solution.id);
            reasonList.push(AUDIT_REASON_THRESHOLD);
          }
        }
      }
    }

    const samplesToCreate = Math.min(samplesize, solutionQuery.rows.length - reviewAudit.length);

  if (samplesize > 0){
    // Zufälliges hinzufügen von x Werten (einmalig) zur ReviewAuditIndexlist
    for (let i = 0; i < samplesToCreate; i++) {
      const number = Math.round(Math.floor(Math.random() * solutionQuery.length));
      if (reviewAudit.includes(solutionQuery[number].id)) {
        i -= 1;
      } else {
        reviewAudit.push(solutionQuery[number].id);
        reasonList.push(AUDIT_REASON_SAMPLESIZE);
      }
    }
  }

    await createAudits(reviewAudit, reasonList, notDoneUsers, homework.id);
  
};

const distributionCronAPI = async (req, res) => {
  await distributeReviews();
  await distributeAudits();
  return res.json({ });
};

export default withSentry(distributionCronAPI);
