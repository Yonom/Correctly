import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectOpenReviews } from '../../../services/api/database/user';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import withSentry from '../../../utils/api/withSentry';

const myReviewsAPI = async (req, res, { userId }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const coursesQuery = await selectOpenReviews(userId);
  return res.json(coursesQuery.rows);
};

export default withSentry(authMiddleware(myReviewsAPI));
