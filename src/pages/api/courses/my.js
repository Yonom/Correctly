import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectCourses } from '../../../services/api/database/user';
import authMiddleware from '../../../utils/api/auth/authMiddleware';

const myCoursesAPI = async (req, res, { userId }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const coursesQuery = await selectCourses(userId);
  return res.json(coursesQuery.rows);
};

export default authMiddleware(myCoursesAPI);
