import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectOpenReviewAudits } from '../../../services/api/database/user';
import authMiddleware from '../../../utils/api/auth/authMiddleware';

const getReviews = async (req, res, { userId }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const coursesQuery = await selectOpenReviewAudits(userId);
  return res.json(coursesQuery.rows);
};

export default authMiddleware(getReviews);
