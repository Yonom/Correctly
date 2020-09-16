import handleRequestMethod from '../../../utils/api/handleRequestMethod';
import { selectHomeworks } from '../../../services/api/database/user';

const doSomething = async (req, res) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  // get parameters
  const { userId } = req.query;

  if (userId == null) {
    // this is an error
    // use 4XX codes for user error and 5XX codes for server errors
    return res.status(400).json({ code: 'auth/no-user-id' });
  }

  const coursesQuery = await selectHomeworks(userId);
  if (coursesQuery.rows.length === 0) {
    return res.status(404).json({ code: 'Homeworks/no-homeworks-found' });
  }

  const homeworkIds = [];
  const homeworkNames = [];
  const homeworkDoingStarts = [];
  const homeworkDoingEnds = [];
  const homeworkCorrectingStarts = [];
  const homeworkCorrectingEnds = [];
  const homeworkTitles = [];
  const homeworkYearcodes = [];

  for (let i = 0; i < coursesQuery.rows.length; i++) {
    homeworkIds.push(coursesQuery.rows[i].id);
    homeworkNames.push(coursesQuery.rows[i].homeworkname);
    homeworkDoingStarts.push(coursesQuery.rows[i].doingstart);
    homeworkDoingEnds.push(coursesQuery.rows[i].doingend);
    homeworkCorrectingStarts.push(coursesQuery.rows[i].correctingstart);
    homeworkCorrectingEnds.push(coursesQuery.rows[i].correctingend);
    homeworkTitles.push(coursesQuery.rows[i].title);
    homeworkYearcodes.push(coursesQuery.rows[i].yearcode);
  }

  // empty json to confirm success
  return res.json({
    ids: homeworkIds,
    names: homeworkNames,
    doingstarts: homeworkDoingStarts,
    doingends: homeworkDoingEnds,
    correctingstarts: homeworkCorrectingStarts,
    correctingEnds: homeworkCorrectingEnds,
    titles: homeworkTitles,
    yearcodes: homeworkYearcodes,
  });
};

export default doSomething;
