import handleRequestMethod from '../../utils/api/handleRequestMethod';
import authMiddleware from '../../utils/api/auth/authMiddleware';
import withSentry from '../../utils/api/withSentry';

const postmanAPI = async (req, res) => {
  await handleRequestMethod(req, res, 'GET');
  if (process.env.NODE_ENV !== 'development') {
    return res.status(401).json({ code: 'auth/unauthorized' });
  }
  return res.json({ authCookie: `${res.getHeader('Set-Cookie').split(';')[0]}; Domain=${req.headers.host.split(':')[0]}; Path=/` });
};

export default withSentry(authMiddleware(postmanAPI));
