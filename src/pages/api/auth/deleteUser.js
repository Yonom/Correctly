import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { isSuperuser } from '../../../utils/auth/isSuperuser';
import { firebaseAdminAuth } from '../../../services/api/firebaseAdmin';
import handleRequestMethod from '../../../utils/api/handleReq';

const deleteUser = (req, res, callerUserId) => {
  handleRequestMethod(req, res, 'POST');
  if (!isSuperuser(callerUserId)) {
    return res.status(401).json({ code: 'auth/not-superuser' });
  }

  const { userId } = req.body;

  // TODO: delete from users table

  // delete from firebase
  firebaseAdminAuth.deleteUser(userId);

  return res.json({});
};

export default authMiddleware(deleteUser);
