import { getTokenData } from './tokenCookie';

const authMiddleware = (func) => {
  return async (req, res, ...args) => {
    if (!req.headers.cookie) {
      return res.status(401).json({ code: 'auth/not-logged-in' });
    }

    let userId;
    let role;
    try {
      const decoded = await getTokenData(req, res);
      userId = decoded.userId;
      role = decoded.role;
    } catch (ex) {
      return res.status(401).json({ code: 'auth/login-expired' });
    }

    return func(req, res, ...args, { userId, role });
  };
};

export default authMiddleware;
