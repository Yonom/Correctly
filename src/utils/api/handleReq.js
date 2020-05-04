/**
 * Date created: 03.05.2020
 * Author: Robin Rinn
 */

/**
 * @param {object} req http request
 * @param {object} res http response
 * @param {string[]} allowedMethods array of allowed methods
 * @returns {object} http resonse 200 if okay and 405 if false method used
 */
export default function handleReq(req, res, ...allowedMethods) {
  if (allowedMethods.includes(req.method)) {
    // Return 200 OK if an allowed method was used.
    return res.status(200);
  }
  // Return 405 'Method Not Allowed' if anything except the
  // allowed methods is used
  return res.writeHead(405, { Allow: allowedMethods });
}
