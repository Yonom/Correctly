import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectEditableHomeworksForUser } from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import { isSuperuser } from '../../../utils/auth/role';
import withSentry from '../../../utils/api/withSentry';

const myEditableHomeworksAPI = async (req, res, { userId, role }) => {
  // Prüfung auf GET-Request
  await handleRequestMethod(req, res, 'GET');

  // verify user request
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  const result = await selectEditableHomeworksForUser(userId, isSuperuser(role));

  return res.json(result.rows.map((homework) => ({
    id: homework.id,
    yearcode: homework.yearcode,
    title: homework.title,
    homeworkName: homework.homeworkname,
    solutionStart: homework.solutionstart,
    solutionEnd: homework.solutionend,
    reviewStart: homework.reviewstart,
    reviewEnd: homework.reviewend,
    firstName: homework.firstname,
    lastName: homework.lastname,
  })));
};

export default withSentry(authMiddleware(myEditableHomeworksAPI));
