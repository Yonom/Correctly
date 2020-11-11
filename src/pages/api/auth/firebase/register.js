import { firebaseAdminAuth } from '../../../../services/api/firebaseAdmin';
import { authProvider } from '../../../../utils/config';
import { verifyEmail } from '../../../../utils/auth/isValidEmail';
import { verifyName } from '../../../../utils/auth/isValidName';
import { verifyStudentId } from '../../../../utils/auth/isValidStudentId';
import { insertUser } from '../../../../services/api/database/user';
import handleRequestMethod from '../../../../utils/api/handleRequestMethod';
import withSentry from '../../../../utils/api/withSentry';

const firebaseRegisterAPI = async (req, res) => {
  // Prüfung auf POST-Request
  await handleRequestMethod(req, res, 'POST');

  if (authProvider !== 'firebase') {
    return res.status(400).json({ code: 'auth/firebase-not-enabled' });
  }

  const {
    token,
    firstName,
    lastName,
    studentId,
  } = req.body || {};

  let decoded;
  try {
    decoded = await firebaseAdminAuth.verifyIdToken(token);
  } catch (err) {
    return res.status(403).json({ code: 'auth/invalid-credential' });
  }

  // verify user request
  try {
    verifyName(firstName);
    verifyName(lastName);
    verifyEmail(decoded.email);
    verifyStudentId(decoded.email, studentId);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  await insertUser(decoded.uid, decoded.email, firstName, lastName, studentId, decoded.email_verified);

  return res.status(200).json({ });
};

export default withSentry(firebaseRegisterAPI);
