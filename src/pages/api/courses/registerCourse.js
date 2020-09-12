import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { createNewCourse } from '../../../services/api/database/course';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';

const registerCourse = async (req, res, { role }) => {
  // Prüfung auf POST-Request
  await handleRequestMethod(req, res, 'POST');

  // verify user request
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  const {
    courseTitle,
    yearCode,
    users,
  } = req.body || {};

  // create new course with attendees as Transaction
  try {
    await createNewCourse(courseTitle, yearCode, users);
    return res.status(200).json({ });
  } catch (err) {
    return res.status(500);
  }
};

export default authMiddleware(registerCourse);
