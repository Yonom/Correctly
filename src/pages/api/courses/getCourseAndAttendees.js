import { APIError } from '../../../utils/fetchPost';

import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { canViewCourse, selectCourseWithAttendees } from '../../../services/api/database/course';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';

const getCourseAndAttendees = async (req, res, { userId, role }) => {
  // Prüfung auf GET-Request
  await handleRequestMethod(req, res, 'GET');

  const { courseId } = req.query;

  // verify if user is a lecturer or superuser
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    try {
      // verify if the user attends the course
      const result2 = await canViewCourse(userId, courseId);
      if (result2.rows === -1) throw new APIError({ code: 'auth/unauthorized' });
    } catch (error) {
      // if user is neither lecturer or superuser nor
      // do they attend the course return 'unauthorized'
      return res.status(400).json({ code });
    }
  }

  const result = await selectCourseWithAttendees(courseId);

  if (result.rowCount !== -1 && result.rowCount !== 0) {
    const users = result.rows.map((o) => ({
      userId: o.userid,
      firstName: o.firstname,
      lastName: o.lastname,
      isModuleCoordinator: o.ismodulecoordinator,
      isLecturer: o.islecturer,
      isStudent: o.isstudent,
    }));
    return res.status(200).json({
      courseId: result.rows[0].id,
      title: result.rows[0].title,
      yearCode: result.rows[0].yearcode,
      users,
    });
  }
  return res.status(404).json(new APIError({ code: 'course/not-found' }));
};

export default authMiddleware(getCourseAndAttendees);
