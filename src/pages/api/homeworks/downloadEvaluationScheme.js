import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { selectHomework, selectHomeworkForUser } from '../../../services/api/database/homework';
import { isSuperuser } from '../../../utils/auth/role';

const downloadEvaluationSchemeAPI = async (req, res, { userId, role }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const { homeworkId } = req.query;

  if (homeworkId == null) {
    return res.status(400).json({ code: 'homework/no-homework-id' });
  }

  let userQuery;
  if (isSuperuser(role)) {
    userQuery = await selectHomework(homeworkId);
  } else {
    userQuery = await selectHomeworkForUser(homeworkId, userId, true);
  }

  if (userQuery.rows.length === 0) {
    return res.status(404).json({ code: 'homework/not-found' });
  }

  const homework = userQuery.rows[0];

  res.setHeader('content-disposition', `attachment; filename=${homework.evaluationschemename[0]}`);
  return res.end(homework.evaluationscheme[0]);
};

export default authMiddleware(downloadEvaluationSchemeAPI);
