import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { isSuperuser } from '../../../utils/auth/role';
import { selectSolutionFileForUser } from '../../../services/api/database/solutions';

const downloadSolutionAPI = async (req, res, { userId, role }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const { solutionId } = req.query;

  if (solutionId == null) {
    return res.status(400).json({ code: 'solution/no-solution-id' });
  }

  const solutionQuery = await selectSolutionFileForUser(solutionId, userId, isSuperuser(role));
  if (solutionQuery.rows.length === 0) {
    return res.status(404).json({ code: 'homework/not-found' });
  }

  const homework = solutionQuery.rows[0];

  res.setHeader('content-disposition', `attachment; filename=${homework.solutionfilesnames[0]}`);
  return res.end(homework.solutionfilesnames[0]);
};

export default authMiddleware(downloadSolutionAPI);
