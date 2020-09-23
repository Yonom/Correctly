import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectHomeworks } from '../../../services/api/database/user';
import authMiddleware from '../../../utils/api/auth/authMiddleware';

const getHomeworks = async (req, res, { userId }) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  const coursesQuery = await selectHomeworks(userId);
  if (coursesQuery.rows.length === 0) {
    return res.status(404).json({ code: 'Homeworks/no-homeworks-found' });
  }

  const homeworkIds = [];
  const homeworkNames = [];
  const homeworkDoingStarts = [];
  const homeworkDoingEnds = [];
  const homeworkTitles = [];
  const homeworkYearcodes = [];

  for (let i = 0; i < coursesQuery.rows.length; i++) {
    homeworkIds.push(coursesQuery.rows[i].id);
    homeworkNames.push(coursesQuery.rows[i].homeworkname);
    homeworkDoingStarts.push(coursesQuery.rows[i].doingstart);
    homeworkDoingEnds.push(coursesQuery.rows[i].doingend);
    homeworkTitles.push(coursesQuery.rows[i].title);
    homeworkYearcodes.push(coursesQuery.rows[i].yearcode);
  }

  // empty json to confirm success
  return res.json({
    ids: homeworkIds,
    names: homeworkNames,
    doingstarts: homeworkDoingStarts,
    doingends: homeworkDoingEnds,
    titles: homeworkTitles,
    yearcodes: homeworkYearcodes,
  });
};

export default authMiddleware(getHomeworks);
