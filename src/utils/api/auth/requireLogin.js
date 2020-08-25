import { getTokenData } from './tokenCookie';

const requireLogin = async (req, res) => {
  if (!req.headers.cookie) {
    res.status(401).json({ code: 'auth/not-logged-in' });
    throw new Error('Attepted to call API with no token.');
  }

  let userId;
  let role;
  try {
    const decoded = await getTokenData(req, res);
    userId = decoded.userId;
    role = decoded.role;
  } catch (ex) {
    res.status(401).json({ code: 'auth/login-expired' });
    throw new Error('Attempted to call API with expired login.');
  }
  return { userId, role };
};

export default requireLogin;
