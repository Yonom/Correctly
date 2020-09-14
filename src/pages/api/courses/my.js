import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectCoursesForUser } from '../../../services/api/database/course';
import authMiddleware from '../../../utils/api/auth/authMiddleware';

const myCourses = async (req, res, { userId }) => {
  // Prüfung auf GET-Request
  await handleRequestMethod(req, res, 'GET');

  const result = await selectCoursesForUser(userId);
  return req.json(result.rows.map((o) => ({
    title: o.title,
    yearCode: o.yearcode,
  })));
};

export default authMiddleware(myCourses);
