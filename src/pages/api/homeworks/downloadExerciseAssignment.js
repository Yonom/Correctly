import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { selectHomeworkTaskForUser } from '../../../services/api/database/homework';
import { isSuperuser } from '../../../utils/auth/role';

const downloadExcerciseAssignmentAPI = async (req, res, { userId, role }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const { homeworkId } = req.query;

  if (homeworkId == null) {
    return res.status(400).json({ code: 'homework/no-homework-id' });
  }

  const homeworkQuery = await selectHomeworkTaskForUser(homeworkId, userId, isSuperuser(role));
  if (homeworkQuery.rows.length === 0) {
    return res.status(404).json({ code: 'homework/not-found' });
  }

  const homework = homeworkQuery.rows[0];

  res.setHeader('content-disposition', `attachment; filename=${homework.taskfilenames[0]}`);
  return res.end(homework.taskfiles[0]);
};

export default authMiddleware(downloadExcerciseAssignmentAPI);
