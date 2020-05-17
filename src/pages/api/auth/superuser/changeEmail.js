import authMiddleware from '../../../../utils/api/auth/authMiddleware';
import { isSuperuser } from '../../../../utils/auth/isSuperuser';
import { firebaseAdminAuth } from '../../../../services/api/firebaseAdmin';
import handleRequestMethod from '../../../../utils/api/handleReq';
import { updateEmailAsSuperuser } from '../../../../services/api/database/superuser';
import { authProvider } from '../../../../utils/config';
import { verifyEmail } from '../../../../utils/auth/isValidEmail';

const deleteUser = async (req, res, callerUserId) => {
  handleRequestMethod(req, res, 'POST');
  if (!isSuperuser(callerUserId)) {
    return res.status(401).json({ code: 'auth/not-superuser' });
  }

  const { userId, email } = req.body;

  // verify data from user
  try {
    verifyEmail(email);
  } catch ({ code }) {
    res.status(400).json({ code });
  }

  // edit email in users table
  const dbRes = await updateEmailAsSuperuser(userId, email);
  if (dbRes.rowCount !== 1) {
    return res.status(404).json({ code: 'auth/invalid-user-id' });
  }

  // update firebase user
  if (authProvider === 'firebase') {
    await firebaseAdminAuth.updateUser(userId, {
      email,
      emailVerified: false, // set verification status to false
    });
  }

  return res.json({});
};

export default authMiddleware(deleteUser);
