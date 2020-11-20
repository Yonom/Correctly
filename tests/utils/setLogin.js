import { getRole } from '../../src/utils/api/auth/role';
import { generateToken } from '../../src/utils/api/auth/tokenJWT';
import { setCookie } from '../../src/utils/api/auth/tokenCookie';

let cookie = '';
export const getCookie = () => {
  return cookie;
};

const setLogin = async (user) => {
  if (user) {
    const { userid, email } = user;
    const role = getRole(email);
    const token = await generateToken(userid, role);
    const res = { setHeader: jest.fn() };

    setCookie(res, token, true);
    [[, cookie]] = res.setHeader.mock.calls;
  }
};

export default setLogin;
