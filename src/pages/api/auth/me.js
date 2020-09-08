import authMiddleware from '../../../utils/api/auth/authMiddleware';
import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectUser } from '../../../services/api/database/user';

const me = async (req, res, { userId, role }) => {
  handleRequestMethod(req, res, 'GET');

  const userQuery = await selectUser(userId);
  if (userQuery.rows.length === 0) {
    return res.status(404).json({ code: 'user/not-found' });
  }

  const { firstname, lastname, email, studentid } = userQuery.rows[0];

  return res.json({
    userId,
    role,
    firstname,
    lastname,
    email,
    studentid,
  });
};

export default authMiddleware(me);
