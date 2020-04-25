import { verifyFirebaseToken, generateToken } from '../../../../utils/api/auth/tokenJWT';
import { getCookie } from '../../../../utils/api/auth/tokenCookie';

export default async (req, res) => {
  const { token } = req.body || {};

  try {
    const decoded = await verifyFirebaseToken(token);
    if (!decoded.email_verified) {
      return res.status(401).json({ error: 'E-Mail not verified.' });
    }

    // TODO update users table

    const cookie = getCookie(await generateToken(decoded.uid), req.secure);
    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({ });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid credentials sent!' });
  }
};
