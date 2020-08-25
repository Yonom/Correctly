import requireLogin from '../../../../utils/api/auth/requireLogin';
import { verifySuperuser } from '../../../../utils/api/auth/role';
import { firebaseAdminAuth } from '../../../../services/api/firebaseAdmin';
import handleRequestMethod from '../../../../utils/api/handleRequestMethod';
import { deactivateUserAsSuperuser } from '../../../../services/api/database/superuser';
import { authProvider } from '../../../../utils/config';

const deleteUser = async (req, res) => {
  await handleRequestMethod(req, res, 'POST');
  const { role } = await requireLogin(req, res);

  // verify user request
  try {
    verifySuperuser(role);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  const { userId } = req.body;

  // deactivate user
  const dbRes = await deactivateUserAsSuperuser(userId);
  if (dbRes.rowCount !== 1) {
    return res.status(404).json({ code: 'auth/invalid-user-id' });
  }

  // delete from firebase
  if (authProvider === 'firebase') {
    await firebaseAdminAuth.deleteUser(userId);
  }

  return res.json({});
};

export default deleteUser;
