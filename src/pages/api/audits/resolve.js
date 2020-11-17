import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { resolveAudit, selectOpenAuditsForSolution } from '../../../services/api/database/audits';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';

const resolveAuditAPI = async (req, res, { userId, role }) => {
  // make sure this is a POST call
  await handleRequestMethod(req, res, 'POST');

  // verify user request
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(403).json({ code });
  }

  const { solutionId } = req.query;

  if (solutionId !== 'undefined') {
    const hasAuditQuery = await selectOpenAuditsForSolution(userId, solutionId);
    if (hasAuditQuery.rows[0].hasaudit) {
      const coursesQuery = await resolveAudit(userId, solutionId);
      return res.status(200).json(coursesQuery.rows);
    }
  }
  return res.status(400).json({ });
};

export default authMiddleware(resolveAuditAPI);
