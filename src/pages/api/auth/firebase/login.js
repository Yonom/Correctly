import { generateToken } from '../../../../utils/api/auth/tokenJWT';
import { setCookie } from '../../../../utils/api/auth/tokenCookie';
import { firebaseAdminAuth } from '../../../../services/api/firebaseAdmin';

export default async (req, res) => {
  const { token } = req.body || {};
  
  try {
    const decoded = await firebaseAdminAuth.verifyIdToken(token);
    if (!decoded.email_verified) {
      return res.status(401).json({ error: 'E-Mail not verified.' });
    }

    // TODO update users table
    (() => {})(decoded.uid, decoded.email, decoded.email_verified);

    setCookie(res, await generateToken(decoded.uid), req.secure);

    return res.status(200).json({ });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid credentials sent!', err });
  }
};
