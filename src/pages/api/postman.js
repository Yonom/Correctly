import handleRequestMethod from '../../utils/api/handleRequestMethod';

const debug = async (req, res) => {
  await handleRequestMethod(req, res, 'GET');
  return res.json({ authCookie: `${res.getHeader('Set-Cookie').split(';')[0]}; Domain=${req.headers.host.split(':')[0]}; Path=/` });
};

export default debug;
