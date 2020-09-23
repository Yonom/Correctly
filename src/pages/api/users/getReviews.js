import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectReviews } from '../../../services/api/database/user';
import authMiddleware from '../../../utils/api/auth/authMiddleware';

const getReviews = async (req, res, { userId }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const coursesQuery = await selectReviews(userId);
  if (coursesQuery.rows.length === 0) {
    return res.status(404).json({ code: 'Reviews/no-reviews-found' });
  }

  const reviewIds = [];
  const reviewHomeworkNames = [];
  const reviewCourseTitles = [];
  const reviewCorrectingStarts = [];
  const reviewCorrectingEnds = [];

  for (let i = 0; i < coursesQuery.rows.length; i++) {
    reviewIds.push(coursesQuery.rows[i].id);
    reviewHomeworkNames.push(coursesQuery.rows[i].homeworkname);
    reviewCourseTitles.push(coursesQuery.rows[i].title);
    reviewCorrectingStarts.push(coursesQuery.rows[i].correctingstart);
    reviewCorrectingEnds.push(coursesQuery.rows[i].correctingend);
  }

  // empty json to confirm success
  return res.json({
    ids: reviewIds,
    homeworks: reviewHomeworkNames,
    courses: reviewCourseTitles,
    starts: reviewCorrectingStarts,
    ends: reviewCorrectingEnds,
  });
};

export default authMiddleware(getReviews);
