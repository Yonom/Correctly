import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectUsersInCourse } from '../../../services/api/database/course';
import { getRole } from '../../../utils/api/auth/role';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { canEditBiography } from '../../../utils/api/users/canEditBiography';

const getUsers = async (req, res, { courseId }) => {
  // make sure this is a POST call
  await handleRequestMethod(req, res, 'GET');

  // get parameters
  const { courseId } = req.query;

  const usersQuery = await selectUsersInCourse(courseId);
  if (usersQuery.rows.length === 0) {
    return res.status(404).json({ code: 'course/not-found' });
  }

  // empty json to confirm success
  return res.json({
    userid: usersQuery.rows
  });
};

export default getUsers;