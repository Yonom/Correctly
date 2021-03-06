import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectEditableCoursesForUser } from '../../../services/api/database/course';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import { isSuperuser } from '../../../utils/auth/role';
import withSentry from '../../../utils/api/withSentry';

const myEditableCoursesAPI = async (req, res, { userId, role }) => {
  // Prüfung auf GET-Request
  await handleRequestMethod(req, res, 'GET');

  // verify user request
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  const result = await selectEditableCoursesForUser(userId, isSuperuser(role));

  return res.json(result.rows.map((o) => ({
    courseId: o.id,
    title: o.title,
    yearCode: o.yearcode,
  })));
};

export default withSentry(authMiddleware(myEditableCoursesAPI));
