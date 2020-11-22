import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectOpenAuditsForSolution } from '../../../services/api/database/audits';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import { isSuperuser } from '../../../utils/auth/role';

const hasAuditAPI = async (req, res, { role, userId }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  // verify user request
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.json({});
  }

  const { solutionId } = req.query;

  const hasAuditQuery = await selectOpenAuditsForSolution(userId, solutionId, isSuperuser(role));
  return res.status(200).json(hasAuditQuery.rows[0]);
};

export default authMiddleware(hasAuditAPI);
