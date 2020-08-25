import requireLogin from '../../../../utils/api/auth/requireLogin';
import { verifySuperuser } from '../../../../utils/api/auth/role';
import { firebaseAdminAuth } from '../../../../services/api/firebaseAdmin';
import handleRequestMethod from '../../../../utils/api/handleRequestMethod';
import { updateEmailAsSuperuser } from '../../../../services/api/database/superuser';
import { authProvider } from '../../../../utils/config';
import { verifyEmail } from '../../../../utils/auth/isValidEmail';

const changeEmail = async (req, res) => {
  await handleRequestMethod(req, res, 'POST');
  const { role } = await requireLogin(req, res);

  const { userId, email } = req.body;

  // verify user request
  try {
    verifySuperuser(role);
    verifyEmail(email);
  } catch ({ code }) {
    return res.status(400).json({ code });
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

export default changeEmail;
