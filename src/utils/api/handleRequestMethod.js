import { init } from '../../services/sentry';
import { refreshToken } from './auth/tokenCookie';

init();

/**
 * @param {object} req http request
 * @param {object} res http response
 * @param {string[]} allowedMethods array of allowed methods
 */
const handleRequestMethod = async (req, res, ...allowedMethods) => {
  if (allowedMethods.includes(req.method)) {
    // update the authentication token to prevent it from expiring
    await refreshToken(req, res);
  } else {
    // Return 405 'Method Not Allowed' if anything except the
    // allowed methods is used
    res.writeHead(405, { Allow: allowedMethods }).json({ code: 'api/method-not-allowed' });
    throw new Error('Wrong request method used.');
  }
};

export default handleRequestMethod;
