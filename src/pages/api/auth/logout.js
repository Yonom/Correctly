import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { clearCookie } from '../../../utils/api/auth/tokenCookie';
import handleRequestMethod from '../../../utils/api/handleRequestMethod';

const logout = (req, res) => {
  handleRequestMethod(req, res, 'POST');
  clearCookie(res, req.secure);
  return res.json({});
};

export default authMiddleware(logout);
