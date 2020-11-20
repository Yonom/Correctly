import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { createLecturerReview } from '../../../services/api/database/review';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import { isSuperuser } from '../../../utils/auth/role';

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

  // create new LecturerReview
  try {
    const queryResult = await createLecturerReview(userId, solutionId, isSuperuser(userId));
    const reviewId = queryResult.rows[0]?.id;
    return res.status(200).json({ id: reviewId });
  } catch (err) {
    return res.status(500);
  }
};

export default authMiddleware(addLecturerReviewAPI);
