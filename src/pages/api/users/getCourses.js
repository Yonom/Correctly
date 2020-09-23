import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectCourses } from '../../../services/api/database/user';
import authMiddleware from '../../../utils/api/auth/authMiddleware';

const getCourses = async (req, res, { userId }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const coursesQuery = await selectCourses(userId);
  if (coursesQuery.rows.length === 0) {
    return res.status(404).json({ code: 'courses/no-courses' });
  }

  const courseTitles = [];
  const courseYearcodes = [];
  for (let i = 0; i < coursesQuery.rows.length; i++) {
    courseTitles.push(coursesQuery.rows[i].title);
    courseYearcodes.push(coursesQuery.rows[i].yearcode);
  }

  // empty json to confirm success
  return res.json({
    titles: courseTitles,
    ids: courseYearcodes,
  });
};

export default authMiddleware(getCourses);
