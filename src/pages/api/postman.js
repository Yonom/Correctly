import authMiddleware from '../../utils/api/auth/authMiddleware';

const debug = async (req, res) => {
  return res.json({ authCookie: `${res.getHeader('Set-Cookie').split(';')[0]}; Domain=${req.headers.host.split(':')[0]}; Path=/` });
};

export default authMiddleware(debug);
