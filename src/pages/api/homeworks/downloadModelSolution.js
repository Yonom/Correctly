import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { selectHomeworkModelSolutionForUser } from '../../../services/api/database/homework';
import { isSuperuser } from '../../../utils/auth/role';

const downloadModelSolutionAPI = async (req, res, { userId, role }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const { homeworkId } = req.query;

  if (homeworkId == null) {
    return res.status(400).json({ code: 'homework/no-homework-id' });
  }

  const homeworkQuery = await selectHomeworkModelSolutionForUser(homeworkId, userId, isSuperuser(role));
  if (homeworkQuery.rows.length === 0) {
    return res.status(404).json({ code: 'homework/not-found' });
  }

  const homework = homeworkQuery.rows[0];

  res.setHeader('content-disposition', `attachment; filename=${homework.modelsolutionname[0]}`);
  return res.end(homework.modelsolution[0]);
};

export default authMiddleware(downloadModelSolutionAPI);
