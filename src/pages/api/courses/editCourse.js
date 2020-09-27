import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { updateCourse } from '../../../services/api/database/course';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';

const editCourse = async (req, res, { role }) => {
  // Prüfung auf POST-Request
  await handleRequestMethod(req, res, 'POST');

  // verify user request
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  const {
    courseId,
    courseTitle,
    yearCode,
    users,
  } = req.body || {};

  // update an existing course as Transaction
  try {
    await updateCourse(courseId, courseTitle, yearCode, users);
    return res.status(200).json({ });
  } catch (err) {
    return res.status(500);
  }
};

export default authMiddleware(editCourse);
