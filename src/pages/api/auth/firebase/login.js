import { generateToken } from '../../../../utils/api/auth/tokenJWT';
import { setCookie } from '../../../../utils/api/auth/tokenCookie';
import { firebaseAdminAuth } from '../../../../services/api/firebaseAdmin';
import { authProvider } from '../../../../utils/config';
import { isValidEmail } from '../../../../utils/isValidEmail';
import { updateMailAndVerified } from '../../../../services/api/database/user';
import handleRequestMethod from '../../../../utils/api/handleReq';

export default async (req, res) => {
  // Prüfung auf POST-Request
  handleRequestMethod(req, res, 'POST');

  if (authProvider !== 'firebase') {
    return res.status(400).json({ code: 'auth/firebase-not-enabled' });
  }

  const { token } = req.body || {};

  let decoded;
  try {
    decoded = await firebaseAdminAuth.verifyIdToken(token);
  } catch (err) {
    return res.status(400).json({ code: 'auth/invalid-credential' });
  }

  if (!isValidEmail(decoded.email)) {
    return res.status(400).json({ code: 'auth/invalid-email' });
  }

  const changedRows = await updateMailAndVerified(decoded.uid, decoded.email, decoded.email_verified);
  if (changedRows.rowCount === 0) {
    return res.status(400).json({ code: 'auth/not-registered' });
  }

  if (!decoded.email_verified) {
    return res.status(401).json({ code: 'auth/not-verified' });
  }

  setCookie(res, await generateToken(decoded.uid), req.secure);
  return res.status(200).json({ });
};
