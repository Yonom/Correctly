import handleRequestMethod from '../../utils/api/handleRequestMethod';
import authMiddleware from '../../utils/api/auth/authMiddleware';

const postmanAPI = async (req, res) => {
  await handleRequestMethod(req, res, 'GET');
  return res.json({ authCookie: `${res.getHeader('Set-Cookie').split(';')[0]}; Domain=${req.headers.host.split(':')[0]}; Path=/` });
};

export default authMiddleware(postmanAPI);
