import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectAuditDataForSolution } from '../../../services/api/database/audits';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import { isSuperuser } from '../../../utils/auth/role';
import { selectSolutionForUser } from '../../../services/api/database/solutions';

const getAuditAPI = async (req, res, { role, userId }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

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

  const getAuditResult = await selectAuditDataForSolution(solutionId);
  if (getAuditResult.rows.length === 0) {
    return res.status(404).json({ code: 'audit/solution-has-no-audit' });
  }
  return res.json(getAuditResult.rows[0]);
};

export default authMiddleware(getAuditAPI);
