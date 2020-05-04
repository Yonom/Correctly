import { firebaseAdminAuth } from '../../../../services/api/firebaseAdmin';
import { authProvider } from '../../../../utils/config';
import { isValidEmail } from '../../../../utils/isValidEmail';
import { isValidName } from '../../../../utils/isValidName';
import { isValidStudentId } from '../../../../utils/isValidStudentId';
import { insertUser } from '../../../../services/api/database/user';

export default async (req, res) => {
  if (authProvider !== 'firebase') {
    return res.status(400).json({ error: 'Server does not support firebase login.' });
  }

  const {
    token,
    firstName,
    lastName,
    studentId,
  } = req.body || {};

  try {
    const decoded = await firebaseAdminAuth.verifyIdToken(token);
    if (!isValidEmail(decoded.email)
      || !isValidName(firstName)
      || !isValidName(lastName)
      || !isValidStudentId(studentId)) {
      return res.status(400).json({ error: 'Data not valid.' });
    }

    await insertUser(decoded.uid, decoded.email, firstName, lastName, studentId, decoded.email_verified);

    return res.status(200).json({ });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid credentials sent!', err });
  }
};
