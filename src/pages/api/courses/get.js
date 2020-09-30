import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectCourse, selectCourseForUser } from '../../../services/api/database/course';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import { isSuperuser } from '../../../utils/auth/role';

const getCourse = async (req, res, { userId, role }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  // verify user request
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  // get parameters
  const { courseId } = req.query;

  if (courseId == null) {
    // this is an error
    // use 4XX codes for user error and 5XX codes for server errors
    return res.status(400).json({ code: 'course/no-course-id' });
  }

  let courseQuery;
  if (isSuperuser(role)) {
    courseQuery = await selectCourse(courseId);
  } else {
    courseQuery = await selectCourseForUser(courseId, userId);
  }

  if (courseQuery.rows.length === 0) {
    return res.status(404).json({ code: 'course/not-found' });
  }

  const course = courseQuery.rows[0];
  // empty json to confirm success
  return res.json(course);
};

export default authMiddleware(getCourse);
