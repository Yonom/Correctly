import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { updateCourse, selectEditableCoursesForUser } from '../../../services/api/database/course';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import { isSuperuser } from '../../../utils/auth/role';

const editCourse = async (req, res, { userId, role }) => {
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

  // update an existing course as Transaction
  if (isSuperuser(role)) {
    try {
      await updateCourse(id, title, yearCode, users);
      return res.status(200).json({ });
    } catch (err) {
      return res.status(500);
    }
  } else {
    try {
      // checks if given userid is allowed to change the given course
      const editableCourses = await selectEditableCoursesForUser(userId);
      let isAllowed = false;
      for (let i = 0; i < editableCourses.rows.length; i++) {
        if (id === editableCourses.rows[i].id) { isAllowed = true; }
      }
      // runs changes as transaction
      if (isAllowed) {
        await updateCourse(id, title, yearCode, users);
        return res.status(200).json({ });
      }
      // throws status(403) if user is not allowed to change the course
      return res.status(403).json({ code: 'courses/updating-not-allowed' });
    } catch (err) {
      return res.status(500);
    }
  }
};

export default authMiddleware(editCourse);
