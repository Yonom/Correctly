import { verifyToken, generateToken } from './tokenJWT';
import { setCookie, getToken } from './tokenCookie';

export default (func) => {
  return async (req, res, ...args) => {
    const token = getToken(req.headers.cookie);
    const decoded = await verifyToken(token);
    const userId = decoded.sub;

    // refresh token
    setCookie(res, generateToken(userId), req.secure);

    return func(req, res, ...args, userId);
  };
};
