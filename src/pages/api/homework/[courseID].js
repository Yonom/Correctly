import { APIError } from '../../../utils/fetchPost';

import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectHomeworkForCourseAndUser } from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';

const myViewableHomework = async (req, res, { userId, role }) => {
  // Prüfung auf GET-Request
  await handleRequestMethod(req, res, 'GET');

  const { courseId } = req.query;

  if (courseId !== undefined && typeof (courseId) !== 'undefined') {
    const result = await selectHomeworkForCourseAndUser(courseId, userId);

    if (result.rowCount !== -1 && result.rowCount !== 0) {
      const homeworks = result.rows.map((o) => ({
        homeworkId: o.homeworkid,
        homeworkName: o.homeworkname,
      }));
      return res.status(200).json({ homeworks });
    }
  }
  return res.status(404).json(new APIError({ code: 'course/not-found' }));
};

export default authMiddleware(myViewableHomework);
