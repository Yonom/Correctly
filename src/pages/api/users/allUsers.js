import handleRequestMethod from '../../../utils/api/handleReq';
import { selectAllUsers } from '../../../services/api/database/user';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyEmployee } from '../../../utils/api/auth/role';

// returns all users a json object.
const allUsers = async (req, res, { role }) => {
  // Check if GET-Request
  handleRequestMethod(req, res, 'GET');

  // verify user request
  try {
    verifyEmployee(role);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  // select all users from database and return
  // them as a response
  const users = await selectAllUsers();
  return res.status(200).json(users);
};

export default authMiddleware(allUsers);
