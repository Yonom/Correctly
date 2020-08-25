import handleRequestMethod from '../../utils/api/handleRequestMethod';
import requireLogin from '../../utils/api/auth/requireLogin';

const debug = async (req, res) => {
  await handleRequestMethod(req, res, 'GET');
  await requireLogin(req, res);
  
  return res.json({ authCookie: `${res.getHeader('Set-Cookie').split(';')[0]}; Domain=${req.headers.host.split(':')[0]}; Path=/` });
};

export default debug;
