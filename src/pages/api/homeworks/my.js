import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectOpenHomeworks } from '../../../services/api/database/user';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import withSentry from '../../../utils/api/withSentry';

const myHomeworksAPI = async (req, res, { userId }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const coursesQuery = await selectOpenHomeworks(userId);
  return res.json(coursesQuery.rows);
};

export default withSentry(authMiddleware(myHomeworksAPI));
