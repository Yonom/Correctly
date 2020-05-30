import handleRequestMethod from '../../../utils/api/handleReq';
import { selectAllUsers } from '../../../services/api/database/user';

// returns all users a json object.
export default async (req, res) => {
// Check if GET-Request
  handleRequestMethod(req, res, 'GET');
  // select all users from database and return
  // them as a response
  const users = await selectAllUsers();
  return res.status(200).json(users);
};
