import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { selectHomeworkSampleSolutionForUser } from '../../../services/api/database/homework';
import { isSuperuser } from '../../../utils/auth/role';
import withSentry from '../../../utils/api/withSentry';

const downloadSampleSolutionAPI = async (req, res, { userId, role }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const { homeworkId } = req.query;

  if (homeworkId == null) {
    return res.status(400).json({ code: 'homework/no-homework-id' });
  }

  const homeworkQuery = await selectHomeworkSampleSolutionForUser(homeworkId, userId, isSuperuser(role));
  if (homeworkQuery.rows.length === 0) {
    return res.status(404).json({ code: 'homework/not-found' });
  }

  const homework = homeworkQuery.rows[0];

  res.setHeader('content-disposition', `attachment; filename="${homework.samplesolutionfilenames[0]}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  return res.end(homework.samplesolutionfiles[0]);
};

export default withSentry(authMiddleware(downloadSampleSolutionAPI));
