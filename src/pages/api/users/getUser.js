import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectUser } from '../../../services/api/database/user';
import { getRole } from '../../../utils/api/auth/role';

const getUser = async (req, res) => {
  // make sure this is a POST call
  await handleRequestMethod(req, res, 'GET');

  // get parameters
  const { userId } = req.query;

  if (userId == null) {
    // this is an error
    // use 4XX codes for user error and 5XX codes for server errors
    return res.status(400).json({ code: 'auth/no-user-id' });
  }

  const userQuery = await selectUser(userId);
  if (userQuery.rows.length === 0) {
    return res.status(404).json({ code: 'user/not-found' });
  }

  const user = userQuery.rows[0];
  const role = getRole(user.email);

  // empty json to confirm success
  return res.json({
    firstName: user.firstname,
    lastName: user.lastname,
    email: user.email,
    role,
  });
};

export default getUser;
