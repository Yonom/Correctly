import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { isSuperuser } from '../../../utils/auth/role';
import { selectSolution, selectSolutionForUser } from '../../../services/api/database/solutions';

const downloadSolutionAPI = async (req, res, { userId, role }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const { solutionId } = req.query;

  if (solutionId == null) {
    return res.status(400).json({ code: 'solution/no-solution-id' });
  }

  let userQuery;
  if (isSuperuser(role)) {
    userQuery = await selectSolution(solutionId);
  } else {
    userQuery = await selectSolutionForUser(solutionId, userId, true);
  }

  if (userQuery.rows.length === 0) {
    return res.status(404).json({ code: 'homework/not-found' });
  }

  const homework = userQuery.rows[0];

  res.setHeader('content-disposition', `attachment; filename=${homework.evaluationschemename[0]}`);
  return res.end(homework.evaluationscheme[0]);
};

export default authMiddleware(downloadSolutionAPI);
