import authMiddleware from '../../../../utils/api/auth/authMiddleware';
import { verifySuperuser } from '../../../../utils/api/auth/role';
import handleRequestMethod from '../../../../utils/api/handleRequestMethod';
import { updateUserAsSuperuser } from '../../../../services/api/database/superuser';
import { verifyName } from '../../../../utils/auth/isValidName';
import { verifyEmail } from '../../../../utils/auth/isValidEmail';
import { verifyStudentId } from '../../../../utils/auth/isValidStudentId';

const changeUser = async (req, res, { role }) => {
  await handleRequestMethod(req, res, 'POST');

  const { userId, email, firstName, lastName, studentId } = req.body;

  // verify user request
  try {
    verifySuperuser(role);
    verifyName(firstName);
    verifyName(lastName);
    verifyEmail(email);
    verifyStudentId(studentId);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  // edit email in users table
  const dbRes = await updateUserAsSuperuser(userId, firstName, lastName, email, studentId);
  if (dbRes.rowCount !== 1) {
    return res.status(404).json({ code: 'auth/invalid-user-id' });
  }

  return res.json({});
};

export default authMiddleware(changeUser);
