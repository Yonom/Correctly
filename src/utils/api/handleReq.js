import { refreshToken } from './auth/tokenCookie';

/**
 * @param {object} req http request
 * @param {object} res http response
 * @param {string[]} allowedMethods array of allowed methods
 */
export default function handleRequestMethod(req, res, ...allowedMethods) {
  if (allowedMethods.includes(req.method)) {
    // update the authentication token to prevent it from expiring
    refreshToken(req, res);
  } else {
    // Return 405 'Method Not Allowed' if anything except the
    // allowed methods is used
    res.writeHead(405, { Allow: allowedMethods }).json({ code: 'api/method-not-allowed' });
    throw new Error('Wrong request method used.');
  }
}
