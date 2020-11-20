import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectAllUsers } from '../../../services/api/database/user';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import withSentry from '../../../utils/api/withSentry';

// returns all users a json object.
const allUsersAPI = async (req, res, { role }) => {
  // Check if GET-Request
  await handleRequestMethod(req, res, 'GET');

  // verify user request
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  // select all users from database and return
  // them as a response
  const users = await selectAllUsers();
  return res.status(200).json(users);
};

export default withSentry(authMiddleware(allUsersAPI));
