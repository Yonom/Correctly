import { parse, serialize } from 'cookie';
import { verifyToken, generateToken } from './tokenJWT';

const COOKIE_NAME = 'token';

const getCookieConfig = (secure) => {
  return {
    httpOnly: true,
    sameSite: true,
    secure,
    path: '/',
    maxAge: 3600,
  };
};

export const getToken = (cookie) => {
  return parse(cookie)[COOKIE_NAME];
};

export const setCookie = (res, token, secure) => {
  const c = serialize(COOKIE_NAME, token, getCookieConfig(secure));
  res.setHeader('Set-Cookie', c);
};

export const clearCookie = (res, secure) => {
  const c = serialize(COOKIE_NAME, '', getCookieConfig(secure));
  res.setHeader('Set-Cookie', c);
};

export const getTokenData = async (req) => {
  const token = getToken(req.headers.cookie);

  const decoded = await verifyToken(token);
  const userId = decoded.sub;
  const { role } = decoded;

  return { userId, role };
};

export const refreshToken = async (req, res) => {
  try {
    const { userId, role } = getTokenData(req);
    setCookie(res, await generateToken(userId, role), req.secure);
  } catch {
    // do nothing
  }
};
