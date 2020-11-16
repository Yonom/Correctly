import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { updateCourse, selectEditableCoursesForUser } from '../../../services/api/database/course';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import { isSuperuser } from '../../../utils/auth/role';
import withSentry from '../../../utils/api/withSentry';

const editCourseAPI = async (req, res, { userId, role }) => {
  // Prüfung auf POST-Request
  await handleRequestMethod(req, res, 'POST');

  // verify user request
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  const {
    id,
    title,
    yearCode,
    users,
  } = req.body || {};

  let isAllowed = false;
  if (isSuperuser(role)) {
    isAllowed = true;
  } else {
  // checks if given userid is allowed to change the given course
    const editableCourses = await selectEditableCoursesForUser(userId, false);
    for (let i = 0; i < editableCourses.rows.length; i++) {
      if (id === editableCourses.rows[i].id) { isAllowed = true; }
    }
  }

  if (!isAllowed) {
    // throws status(403) if user is not allowed to change the course
    return res.status(403).json({ code: 'course/updating-not-allowed' });
  }

  // runs changes as transaction
  await updateCourse(id, title, yearCode, users);
  return res.status(200).json({ });
};

export default withSentry(authMiddleware(editCourseAPI));
