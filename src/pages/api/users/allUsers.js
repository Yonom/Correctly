import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectAllUsers } from '../../../services/api/database/user';
import requireLogin from '../../../utils/api/auth/requireLogin';
import { verifyEmployee } from '../../../utils/api/auth/role';

// returns all users a json object.
const allUsers = async (req, res) => {
  // Check if GET-Request
  await handleRequestMethod(req, res, 'GET');
  const { role } = await requireLogin(req, res);

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

export default allUsers;
