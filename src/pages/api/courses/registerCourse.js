import handleRequestMethod from '../../../utils/api/handleReq';
import { createNewCourse } from '../../../services/api/database/course';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { EMPLOYEE } from '../../../utils/api/auth/role';


const registerCourse = async (req, res, { role }) => {
  // Prüfung auf POST-Request
  handleRequestMethod(req, res, 'POST');
  if (role !== EMPLOYEE) {
    return res.status(401).json({ code: 'auth/unauthorized' });
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
