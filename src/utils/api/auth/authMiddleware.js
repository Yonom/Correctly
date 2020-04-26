import { verifyToken, generateToken } from './tokenJWT';
import { getCookie, getToken } from './tokenCookie';

export default (func) => {
  return async (req, res, ...args) => {
    const token = getToken(req.headers.cookie);
    const decoded = await verifyToken(token);
    const userId = decoded.sub;

    // refresh token
    res.setHeader('Set-Cookie', getCookie(generateToken(userId), req.secure));

    return func(req, res, ...args, userId);
  };
};
