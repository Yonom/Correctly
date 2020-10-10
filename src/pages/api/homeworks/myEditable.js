import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectAllHomeworks, selectEditableHomeworksForUser } from '../../../services/api/database/homework';
import authMiddleware from '../../../utils/api/auth/authMiddleware';
import { verifyLecturer } from '../../../utils/api/auth/role';
import { isSuperuser } from '../../../utils/auth/role';

const myEditableHomeworks = async (req, res, { userId, role }) => {
  // Prüfung auf GET-Request
  await handleRequestMethod(req, res, 'GET');

  // verify user request
  try {
    verifyLecturer(role);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }

  let result;
  if (isSuperuser(role)) {
    result = await selectAllHomeworks();
  } else {
    result = await selectEditableHomeworksForUser(userId);
  }

  return res.json(result.rows.map((homework) => ({
    id: homework.id,
    yearcode: homework.yearcode,
    title: homework.title,
    homeworkName: homework.homeworkname,
    doingStart: homework.doingstart,
    doingEnd: homework.doingend,
    correctingStart: homework.correctingstart,
    correctingEnd: homework.correctingend,
    firstName: homework.firstname,
    lastName: homework.lastname,
  })));
};

export default authMiddleware(myEditableHomeworks);
