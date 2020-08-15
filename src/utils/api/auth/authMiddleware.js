import { verifyToken, generateToken } from './tokenJWT';
import { setCookie, getToken } from './tokenCookie';

const authMiddleware = (func) => {
  return async (req, res, ...args) => {
    if (!req.headers.cookie) {
      return res.status(401).json({ code: 'auth/not-logged-in' });
    }

    const token = getToken(req.headers.cookie);
    let userId;
    let role;
    try {
      const decoded = await verifyToken(token);
      userId = decoded.sub;
      role = decoded.role;
    } catch (ex) {
      return res.status(401).json({ code: 'auth/login-expired' });
    }

    // refresh token
    setCookie(res, await generateToken(userId, role), req.secure);

    return func(req, res, ...args, { userId, role });
  };
};

export default authMiddleware;
