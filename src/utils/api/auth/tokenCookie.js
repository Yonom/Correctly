import { parse, serialize } from 'cookie';

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
