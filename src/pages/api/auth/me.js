import authMiddleware from '../../../utils/api/auth/authMiddleware';
import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectUser } from '../../../services/api/database/user';

const me = async (req, res, { userId, role }) => {
  handleRequestMethod(req, res, 'GET');

  const { firstname, lastname, email, studentid } = await selectUser(userId);

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
