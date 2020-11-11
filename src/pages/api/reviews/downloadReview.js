import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { isSuperuser } from '../../../utils/auth/role';
import { selectReviewFileForUser } from '../../../services/api/database/review';

const downloadReviewAPI = async (req, res, { userId, role }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const { reviewId } = req.query;

  if (reviewId == null) {
    return res.status(400).json({ code: 'review/no-review-id' });
  }

  const reviewQuery = await selectReviewFileForUser(reviewId, userId, isSuperuser(role));
  if (reviewQuery.rows.length === 0) {
    return res.status(404).json({ code: 'review/not-found' });
  }

  const review = reviewQuery.rows[0];

  res.setHeader('content-disposition', `attachment; filename=${review.reviewfilenames[0]}`);
  return res.end(review.reviewfilenames[0]);
};

export default authMiddleware(downloadReviewAPI);
