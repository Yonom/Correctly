import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { isLecturer, isStudent, isSuperuser } from '../../../utils/auth/role';
import { selectSolutionsForHomeworkAndUser } from '../../../services/api/database/solutions';
import { selectAllReviewsForSolution } from '../../../services/api/database/review';

import { DEFAULT_TEXT_FILENAME } from '../../../utils/constants';

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

  if (typeof (solution.solutionfilenames[0] !== 'undefined') && solution.solutionfilenames[0] === null && solution.solutioncomment !== null) {
    solution.solutionfilenames[0] = DEFAULT_TEXT_FILENAME;
  }

  const reviewsQuery = await selectAllReviewsForSolution(solution.id, userId, isSuperuser(role));
  const reviews = reviewsQuery.rows;

  return res.json({
    solution,
    reviews,
    reviewsVisible: !isStudent(role),
  });
};
export default authMiddleware(getSolutionAPI);
