/**
 * Date created: 03.05.2020
 * Author: Robin Rinn
 */

/**
 * @param {object} req http request
 * @param {object} res http response
 * @param {string[]} allowedMethods array of allowed methods
 * @returns {boolean} true if okay and throws error if false
 */
export default function handleRequestMethod(req, res, ...allowedMethods) {
  if (allowedMethods.includes(req.method)) {
    // Return 200 OK if an allowed method was used.
    return true;
  }
  // Return 405 'Method Not Allowed' if anything except the
  // allowed methods is used
  // return res.writeHead(405, { Allow: allowedMethods });
  res.writeHead(405, { Allow: allowedMethods }).end();
  throw new Error('Wrong request method used.');
}
