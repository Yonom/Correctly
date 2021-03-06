import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { selectReviewForUserToShow } from '../../../services/api/database/review';
import { isStudent, isSuperuser } from '../../../utils/auth/role';
import withSentry from '../../../utils/api/withSentry';

const getReviewAPI = async (req, res, { userId, role }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const { reviewId } = req.query;

  if (reviewId == null) {
    // error occurred (user error)
    return res.status(400).json({ code: 'review/no-review-id' });
  }

  const reviewQuery = await selectReviewForUserToShow(reviewId, userId, isSuperuser(role));
  if (reviewQuery.rows.length === 0) {
    return res.status(404).json({ code: 'review/not-found' });
  }

  const review = reviewQuery.rows[0];

  if (isStudent(role)) {
    if (review.issystemreview) {
      review.reviewcomment = `${review.reviewcomment?.split('\n')?.[0] ?? ''}\n\n<omitted>`;
    } else if (!review.islecturerreview) {
      review.userid = '';
      review.reviewerfn = 'Anonymous';
      review.reviewerln = '';
    }
  }

  // return empty JSON to confirm success
  return res.json({ ...review });
};

export default withSentry(authMiddleware(getReviewAPI));
