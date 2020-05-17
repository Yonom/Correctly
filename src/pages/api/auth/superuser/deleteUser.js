import authMiddleware from '../../../../utils/api/auth/authMiddleware';
import { isSuperuser } from '../../../../utils/auth/isSuperuser';
import { firebaseAdminAuth } from '../../../../services/api/firebaseAdmin';
import handleRequestMethod from '../../../../utils/api/handleReq';
import { deleteUserAsSuperuser } from '../../../../services/api/database/superuser';
import { authProvider } from '../../../../utils/config';

const deleteUser = async (req, res, callerUserId) => {
  handleRequestMethod(req, res, 'POST');
  if (!isSuperuser(callerUserId)) {
    return res.status(401).json({ code: 'auth/not-superuser' });
  }

  const { userId } = req.body;

  // delete from users table
  const dbRes = await deleteUserAsSuperuser(userId);
  if (dbRes.rowCount !== 1) {
    return res.status(404).json({ code: 'auth/invalid-user-id' });
  }

  // delete from firebase
  if (authProvider === 'firebase') {
    await firebaseAdminAuth.deleteUser(userId);
  }

  return res.json({});
};

export default authMiddleware(deleteUser);
