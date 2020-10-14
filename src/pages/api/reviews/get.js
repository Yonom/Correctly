import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { selectReview } from '../../../services/api/database/review';

const getReview = async (req, res, { userId }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const { reviewId } = req.query;

  if (reviewId == null) {
    // error occurred (user error)
    return res.status(400).json({ code: 'review/no-review-id' });
  }
  const reviewQuery = await selectReview(reviewId, userId);

  if (reviewQuery.rows.length === 0) {
    return res.status(404).json({ code: 'review/not-found' });
  }

  const review = reviewQuery.rows[0];

  // return empty JSON to confirm success
  return res.json({ ...review });
};

export default authMiddleware(getReview);
