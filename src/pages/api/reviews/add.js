import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { createLecturerReview } from '../../../services/api/database/review';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import { isSuperuser } from '../../../utils/auth/role';
import { selectSolutionForUser } from '../../../services/api/database/solutions';

const addLecturerReviewAPI = async (req, res, { role, userId }) => {
  // Prüfung auf POST-Request
  await handleRequestMethod(req, res, 'POST');

  // verify user request
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  const { solutionId } = req.query;

  const permisionCheck = await selectSolutionForUser(solutionId, userId, isSuperuser(role));
  if (permisionCheck.rows.length === 0) {
    return res.status(404).json({ code: 'solution/not-found' });
  }

  // create new LecturerReview
  const queryResult = await createLecturerReview(userId, solutionId, isSuperuser(userId));
  const reviewId = queryResult.rows[0]?.id;
  return res.json({ id: reviewId });
};

export default authMiddleware(addLecturerReviewAPI);
