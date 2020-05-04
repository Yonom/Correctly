import { firebaseAdminAuth } from '../../../../services/api/firebaseAdmin';
import { authProvider } from '../../../../utils/config';
import { isValidEmail } from '../../../../utils/isValidEmail';
import { isValidName } from '../../../../utils/isValidName';
import { isValidStudentId } from '../../../../utils/isValidStudentId';
import { insertUser } from '../../../../services/api/database/user';

export default async (req, res) => {
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

  if (!isValidEmail(decoded.email)
      || !isValidName(firstName)
      || !isValidName(lastName)
      || !isValidStudentId(decoded.email, studentId)) {
    return res.status(400).json({ code: 'auth/invalid-data' });
  }

  await insertUser(decoded.uid, decoded.email, firstName, lastName, studentId, decoded.email_verified);

  return res.status(200).json({ });
};
