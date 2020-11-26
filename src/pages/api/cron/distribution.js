import { selectSolutions } from '../../../services/api/database/solutions';
import { selectHomeworksForDistributionOfAudits, selectHomeworksForDistributionOfReviews } from '../../../services/api/database/homework';
import { createReviews, selectReviewsForSolution, selectUsersWithoutReview } from '../../../services/api/database/review';
import { createAudits } from '../../../services/api/database/audits';
import { POINTS, ZERO_TO_ONE_HUNDRED, THRESHOLD_NA, AUDIT_REASON_DID_NOT_SUBMIT_REVIEW, AUDIT_REASON_MISSING_REVIEW_SUBMISSION, AUDIT_REASON_THRESHOLD, AUDIT_REASON_SAMPLESIZE } from '../../../utils/constants';
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
    const solutions = solutionQuery.rows;
    if (solutions.length <= 2) {
      // do not distribute, but mark the homework as distributed and create audits
      await createReviews([], solutions, homework.reviewercount, homework.id);
    } else {
      const solutionsList = shuffle(solutions);
      await createReviews(solutionsList, [], homework.reviewercount, homework.id);
    }
  }
};

const getAuditForSolutionReviews = (homework, notDoneUsers, solution, reviews) => {
  const { threshold, evaluationvariant } = homework;

  // DID_NOT_SUBMIT_REVIEW
  // Rausfiltern der not done users
  if (notDoneUsers.filter((u) => u.userid === solution.userid).length) {
    return {
      solutionId: solution.id,
      reason: AUDIT_REASON_DID_NOT_SUBMIT_REVIEW,
    };
  }

  // MISSING_REVIEW_SUBMISSION
  // Rausfiltern der Missing reviews
  for (const review of reviews) {
    if (!review.issubmitted) {
      return {
        solutionId: solution.id,
        reason: AUDIT_REASON_MISSING_REVIEW_SUBMISSION,
      };
    }
  }

  // THRESHOLD
  // Wenn 2 Bewerter werden die reviews auf threshold geprüft falls dieser nicht N/A
  if (reviews.length === 2 && threshold !== THRESHOLD_NA) {
    const grades = [];
    grades.push(reviews[0].percentagegrade);
    grades.push(reviews[1].percentagegrade);

    if (evaluationvariant === ZERO_TO_ONE_HUNDRED || evaluationvariant === POINTS) {
      // Zahlen threshold
      const delta = Math.abs(grades[0] - grades[1]);

      if (delta >= threshold) {
        return {
          solutionId: solution.id,
          reason: AUDIT_REASON_THRESHOLD,
        };
      }
    } else if (grades[0] !== grades[1]) {
      // Nominaler threshold
      return {
        solutionId: solution.id,
        reason: AUDIT_REASON_THRESHOLD,
      };
    }
  }

  // SAMPLESIZE_CANDIDATE
  return null;
};

const distributeAudits = async () => {
  const homeworks = (await selectHomeworksForDistributionOfAudits()).rows;
  for (const homework of homeworks) {
    const { samplesize } = homework;
    const notDoneUsers = (await selectUsersWithoutReview(homework.id)).rows;
    const solutions = (await selectSolutions(homework.id)).rows;
    const audits = [];

    const samplesizeCandidates = [];
    for (const solution of solutions) {
      const reviews = (await selectReviewsForSolution(solution.id)).rows;
      // no reviews means either PLAGIARISM or TOO_FEW_SOLUTIONS
      if (reviews.length !== 0) {
        const audit = getAuditForSolutionReviews(homework, notDoneUsers, solution, reviews);
        if (audit !== null) {
          audits.push(audit);
        } else {
          samplesizeCandidates.push(solution);
        }
      }
    }

    // SAMPLESIZE
    // Zufälliges hinzufügen von x Werten (einmalig) zur ReviewAuditIndexlist
    const samplesToCreate = Math.min(samplesize, samplesizeCandidates.length);
    for (let i = 0; i < samplesToCreate; i++) {
      const number = Math.round(Math.floor(Math.random() * samplesizeCandidates.length));
      audits.push({
        solutionId: samplesizeCandidates[number].id,
        reason: AUDIT_REASON_SAMPLESIZE,
      });
      samplesizeCandidates.splice(number, 1);
    }

    await createAudits(audits, notDoneUsers, homework.id);
  }
};

const distributionCronAPI = async (req, res) => {
  await distributeReviews();
  await distributeAudits();
  return res.json({ });
};

export default withSentry(distributionCronAPI);
