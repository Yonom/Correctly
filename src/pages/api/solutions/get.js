import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { isLecturer, isStudent, isSuperuser } from '../../../utils/auth/role';
import { selectSolutionsForHomeworkAndUser } from '../../../services/api/database/solutions';
import { selectAllReviewsForSolution } from '../../../services/api/database/review';

const getSolutionAPI = async (req, res, { userId, role }) => {
  await handleRequestMethod(req, res, 'GET');

  const { homeworkId } = req.query;
  const requestedUserId = req.query.userId;

  const solutionQuery = await selectSolutionsForHomeworkAndUser(homeworkId, requestedUserId, userId, isSuperuser(role));
  if (solutionQuery.rows.length === 0) {
    return res.status(404).json({ code: 'solution/not-found' });
  }

  const solution = solutionQuery.rows[0];

  if (!isSuperuser(role) && !isLecturer(role) && !solution.gradespublished) solution.percentagegrade = null;

  const reviewsQuery = await selectAllReviewsForSolution(solution.id, userId, isSuperuser(role));
  const reviews = reviewsQuery.rows;

  if (isStudent(role)) {
    if (!solution.gradespublished) {
      reviews.length = 0;
    } else {
      reviews.forEach((r) => {
        if (!r.issystemreview && !r.islecturerreview) {
          r.reviewerfirstname = 'Anonymous';
          r.reviewerlastname = '';
        }
      });
    }
  }

  return res.json({
    solution,
    reviews,
    canReview: !isStudent(role),
  });
};
export default authMiddleware(getSolutionAPI);
