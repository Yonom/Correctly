import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectOpenAudits } from '../../../services/api/database/user';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import withSentry from '../../../utils/api/withSentry';

const myAuditsAPI = async (req, res, { userId }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const coursesQuery = await selectOpenAudits(userId);
  return res.json(coursesQuery.rows);
};

export default withSentry(authMiddleware(myAuditsAPI));
