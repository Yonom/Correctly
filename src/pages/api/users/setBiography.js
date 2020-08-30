import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { setBiography } from '../../../services/api/database/user';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { canEditBiography } from '../../../utils/api/users/canEditBiography';

const setBiographyAPI = async (req, res, { userId: callerUserId, role: callerRole }) => {
  // make sure this is a POST call
  await handleRequestMethod(req, res, 'POST');

  // get parameters
  const { userId, biography } = req.body;

  if (userId == null) {
    // this is an error
    // use 4XX codes for user error and 5XX codes for server errors
    return res.status(400).json({ code: 'auth/no-user-id' });
  }

  // make sure user has permission
  if (!canEditBiography(callerUserId, callerRole, userId)) {
    return res.status(401).json({ code: 'auth/unauthorized' });
  }

  // update biography
  await setBiography(userId, biography);

  // empty json to confirm success
  return res.json({});
};

export default authMiddleware(setBiographyAPI);
