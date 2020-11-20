import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { isLecturer, isSuperuser } from '../../../utils/auth/role';
import { updateHomeworkGradesPublished, selectEditableHomeworksForUser } from '../../../services/api/database/homework';
import withSentry from '../../../utils/api/withSentry';

const publishGradesAPI = async (req, res, { role, userId }) => {
  // Prüfung auf POST-Request
  await handleRequestMethod(req, res, 'POST');
  // checking wheather the user is allowed to edit this homework and therefore
  // allowed to publish grades
  const myEditables = await selectEditableHomeworksForUser(userId, isSuperuser(role));
  const { homeworkId } = req.body || {};
  let isAllowed = false;
  if (!isLecturer(role) && !isSuperuser(role)) {
    return res.status(400).json({ code: 'homework/publishing-grades-not-allowed' });
  }
  for (let i = 0; i < myEditables.rows.length; i++) {
    if (homeworkId === myEditables.rows[i].id) { isAllowed = true; }
  }
  if (!isAllowed) {
    return res.status(400).json({ code: 'homework/publishing-grades-not-allowed' });
  }

  // publish grades of homework as Transaction
  try {
    await updateHomeworkGradesPublished(homeworkId);
    return res.status(200).json({ });
  } catch (err) {
    return res.status(500);
  }
};

export default withSentry(authMiddleware(publishGradesAPI));
