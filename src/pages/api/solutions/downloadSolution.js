import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { isSuperuser } from '../../../utils/auth/role';
import { selectSolutionFileForUser } from '../../../services/api/database/solutions';
import withSentry from '../../../utils/api/withSentry';

const downloadSolutionAPI = async (req, res, { userId, role }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const { solutionId } = req.query;

  if (solutionId == null) {
    return res.status(400).json({ code: 'solution/no-solution-id' });
  }

  const solutionQuery = await selectSolutionFileForUser(solutionId, userId, isSuperuser(role));
  if (solutionQuery.rows.length === 0) {
    return res.status(404).json({ code: 'solution/not-found' });
  }

  const solution = solutionQuery.rows[0];

  const filename = solution.solutionfilenames[0];
  const homeworkFile = solution.solutionfiles[0];

  res.setHeader('content-disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  return res.end(homeworkFile);
};

export default withSentry(authMiddleware(downloadSolutionAPI));
