import { parse, serialize } from 'cookie';

const COOKIE_NAME = 'token';
const getCookieConfig = (secure) => {
  return {
    httpOnly: true,
    sameSite: true,
    secure,
  };
};

export const getToken = (cookie) => {
  const { token } = parse(cookie)[COOKIE_NAME];
  return token;
};

export const getCookie = (token, secure) => {
  return serialize(COOKIE_NAME, token, getCookieConfig(secure));
};

export const clearCookie = (secure) => {
  return serialize(COOKIE_NAME, '', getCookieConfig(secure));
};
