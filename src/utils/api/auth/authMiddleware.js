import { verifyToken, generateToken } from './tokenJWT';
import { setCookie, getToken } from './tokenCookie';

export default (func) => {
  return async (req, res, ...args) => {
    if (!req.headers.cookie) {
      return res.status(401).json({ code: 'auth/not-logged-in' });
    }

    const token = getToken(req.headers.cookie);
    let userId;
    try {
      const decoded = await verifyToken(token);
      userId = decoded.sub;
    } catch (ex) {
      return res.status(401).json({ code: 'auth/login-expired' });
    }

    // refresh token
    setCookie(res, generateToken(userId), req.secure);

    return func(req, res, ...args, userId);
  };
};
