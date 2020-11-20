import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectUser } from '../../../services/api/database/user';
import { getTokenData } from '../../../utils/api/auth/tokenCookie';
import withSentry from '../../../utils/api/withSentry';

const meAPI = async (req, res) => {
  handleRequestMethod(req, res, 'GET');

  let userId;
  let role;
  try {
    const token = await getTokenData(req);
    userId = token.userId;
    role = token.role;
  } catch {
    return res.json({ loggedIn: false });
  }

  const userQuery = await selectUser(userId);
  if (userQuery.rows.length === 0) {
    return res.status(404).json({ code: 'user/not-found' });
  }

  const { firstname, lastname, email, studentid } = userQuery.rows[0];

  return res.json({
    loggedIn: true,
    userId,
    role,
    firstname,
    lastname,
    email,
    studentid,
  });
};

export default withSentry(meAPI);
