import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { isStudent, isSuperuser } from '../../../utils/auth/role';
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

  const reviewsQuery = await selectAllReviewsForSolution(solution.id, userId, isSuperuser(role));
  const reviews = reviewsQuery.rows;

  return res.json({
    solution,
    reviews,
    reviewsVisible: !isStudent(role),
  });
};
export default authMiddleware(getSolutionAPI);
