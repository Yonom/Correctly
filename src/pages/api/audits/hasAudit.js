import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectOpenAuditsForSolution } from '../../../services/api/database/audits';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';

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

  if (solutionId !== 'undefined') {
    const hasAuditQuery = await selectOpenAuditsForSolution(userId, solutionId);
    return res.status(200).json(hasAuditQuery.rows[0]);
  }
  return res.json({ hasaudit: false });
};

export default authMiddleware(hasAuditAPI);
