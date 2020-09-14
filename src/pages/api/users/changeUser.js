import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifySuperuser } from '../../../utils/api/auth/role';
import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { updateUserAsSuperuser } from '../../../services/api/database/superuser';
import { verifyName } from '../../../utils/auth/isValidName';
import { verifyEmail } from '../../../utils/auth/isValidEmail';
import { verifyStudentId } from '../../../utils/auth/isValidStudentId';
import { authProvider } from '../../../utils/config';
import { firebaseAdminAuth } from '../../../services/api/firebaseAdmin';

const changeUser = async (req, res, { role }) => {
  await handleRequestMethod(req, res, 'POST');

  const { userId, email, firstName, lastName, studentId } = req.body;

  // verify user request
  try {
    verifySuperuser(role);
    verifyName(firstName);
    verifyName(lastName);
    verifyEmail(email);
    verifyStudentId(email, studentId);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  // edit email in users table
  const dbRes = await updateUserAsSuperuser(userId, firstName, lastName, email, studentId);
  if (dbRes.rowCount !== 1) {
    return res.status(404).json({ code: 'auth/invalid-user-id' });
  }

  // update firebase user
  if (authProvider === 'firebase') {
    const { email: oldEmail } = await firebaseAdminAuth.getUser(userId);
    if (oldEmail !== email) {
      await firebaseAdminAuth.updateUser(userId, {
        email,
        emailVerified: false, // set verification status to false
      });
    }
  }

  return res.json({});
};

export default authMiddleware(changeUser);
