import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { resolveAudit, selectOpenAuditsForSolution } from '../../../services/api/database/audits';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import { isSuperuser } from '../../../utils/auth/role';
import { selectSolutionForUser } from '../../../services/api/database/solutions';

const resolveAuditAPI = async (req, res, { userId, role }) => {
  // make sure this is a POST call
  await handleRequestMethod(req, res, 'POST');

  // verify user request
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(401).json({ code });
  }

  const { solutionId } = req.query;
  const permisionCheck = await selectSolutionForUser(solutionId, userId, isSuperuser(role));
  if (permisionCheck.rows.length === 0) {
    return res.status(404).json({ code: 'solution/not-found' });
  }

  const hasAuditQuery = await selectOpenAuditsForSolution(userId, solutionId, isSuperuser(role));
  if (hasAuditQuery.rows[0]?.hasaudit) {
    const coursesQuery = await resolveAudit(userId, solutionId);
    return res.json(coursesQuery.rows);
  }
  return res.status(404).json({ code: 'audit/not-found' });
};

export default authMiddleware(resolveAuditAPI);
