import { generateToken } from '../../../../utils/api/auth/tokenJWT';
import { setCookie } from '../../../../utils/api/auth/tokenCookie';
import { firebaseAdminAuth } from '../../../../services/api/firebaseAdmin';
import { authProvider } from '../../../../utils/config';
import { isValidEmail } from '../../../../utils/isValidEmail';
import { updateMailAndVerified } from '../../../../services/api/database/user';

export default async (req, res) => {
  if (authProvider !== 'firebase') {
    return res.status(400).json({ error: 'Server does not support firebase login.' });
  }

  const { token } = req.body || {};

  try {
    const decoded = await firebaseAdminAuth.verifyIdToken(token);
    if (isValidEmail(decoded.email)) {
      return res.status(400).json({ error: 'E-Mail not valid.' });
    }
    updateMailAndVerified(decoded.uid, decoded.email, decoded.email_verified);

    if (!decoded.email_verified) {
      return res.status(401).json({ error: 'E-Mail not verified.' });
    }
    setCookie(res, await generateToken(decoded.uid), req.secure);

    return res.status(200).json({ });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid credentials sent!', err });
  }
};
