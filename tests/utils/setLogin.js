import { getRole } from '../../src/utils/api/auth/role';
import { generateToken } from '../../src/utils/api/auth/tokenJWT';
import { setCookie } from '../../src/utils/api/auth/tokenCookie';

let cookie;
export const getTestCookie = () => {
  return cookie;
};

export const setTestCookie = (c) => {
  cookie = c;
};

const setLogin = async (user) => {
  if (user) {
    const { userid, email } = user;
    const role = getRole(email);
    const token = await generateToken(userid, role);
    const res = { setHeader: jest.fn() };

    setCookie(res, token, true);
    [[, cookie]] = res.setHeader.mock.calls;
  } else {
    cookie = undefined;
  }
};

export default setLogin;
